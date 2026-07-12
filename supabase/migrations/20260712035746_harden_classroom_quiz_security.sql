drop index if exists public.responses_participant_question_key;

create table if not exists public.classroom_question_cards (
  question_id text primary key references public.questions(id) on delete cascade,
  prompt text not null,
  options jsonb not null,
  context text not null default '',
  question_type text not null,
  difficulty text not null
);

create table if not exists public.question_feedback (
  question_id text primary key references public.questions(id) on delete cascade,
  rationale text not null,
  correct_answer text not null
);

alter table public.classroom_question_cards enable row level security;
alter table public.question_feedback enable row level security;
revoke all on public.classroom_question_cards from anon, authenticated;
revoke all on public.question_feedback from anon, authenticated;
grant select on public.classroom_question_cards to authenticated;
grant select on public.question_feedback to authenticated;

create policy "participants and teachers read safe question cards"
on public.classroom_question_cards for select to authenticated
using (
  exists (select 1 from public.teacher_profiles tp where tp.user_id = (select auth.uid()))
  or exists (
    select 1 from public.participants p
    join public.classroom_sessions cs on cs.id = p.session_id
    where p.user_id = (select auth.uid())
      and cs.status in ('lobby', 'active') and cs.expires_at > now()
  )
);

create policy "feedback unlocks after own response"
on public.question_feedback for select to authenticated
using (
  exists (select 1 from public.teacher_profiles tp where tp.user_id = (select auth.uid()))
  or exists (
    select 1 from public.responses r
    join public.participants p on p.id = r.participant_id
    where r.question_id = question_feedback.question_id
      and p.user_id = (select auth.uid())
  )
);

insert into public.classroom_question_cards (question_id, prompt, options, context, question_type, difficulty)
select id, prompt, options, context, type, difficulty
from public.questions where status in ('pending-review', 'published')
on conflict (question_id) do update set
  prompt = excluded.prompt, options = excluded.options, context = excluded.context,
  question_type = excluded.question_type, difficulty = excluded.difficulty;

insert into public.question_feedback (question_id, rationale, correct_answer)
select id, rationale, correct_answers ->> 0
from public.questions where status in ('pending-review', 'published')
on conflict (question_id) do update set
  rationale = excluded.rationale, correct_answer = excluded.correct_answer;

create or replace function private.sync_classroom_question_projection()
returns trigger language plpgsql security definer set search_path = ''
as $function$
begin
  if new.status in ('pending-review', 'published') then
    insert into public.classroom_question_cards (question_id, prompt, options, context, question_type, difficulty)
    values (new.id, new.prompt, new.options, new.context, new.type, new.difficulty)
    on conflict (question_id) do update set
      prompt = excluded.prompt, options = excluded.options, context = excluded.context,
      question_type = excluded.question_type, difficulty = excluded.difficulty;
    insert into public.question_feedback (question_id, rationale, correct_answer)
    values (new.id, new.rationale, new.correct_answers ->> 0)
    on conflict (question_id) do update set
      rationale = excluded.rationale, correct_answer = excluded.correct_answer;
  else
    delete from public.question_feedback where question_id = new.id;
    delete from public.classroom_question_cards where question_id = new.id;
  end if;
  return new;
end;
$function$;

drop trigger if exists sync_classroom_question_projection on public.questions;
create trigger sync_classroom_question_projection
after insert or update of prompt, options, context, type, difficulty, rationale, correct_answers, status
on public.questions for each row execute function private.sync_classroom_question_projection();
revoke all on function private.sync_classroom_question_projection() from public, anon, authenticated;

create or replace function private.score_classroom_response()
returns trigger language plpgsql security definer set search_path = ''
as $function$
begin
  select q.correct_answers @> jsonb_build_array(new.answer #>> '{}')
  into new.is_correct from public.questions q where q.id = new.question_id;
  new.duration_ms := greatest(coalesce(new.duration_ms, 0), 0);
  return new;
end;
$function$;

drop trigger if exists score_classroom_response on public.responses;
create trigger score_classroom_response before insert or update of answer
on public.responses for each row execute function private.score_classroom_response();
revoke all on function private.score_classroom_response() from public, anon, authenticated;

create policy "students update own responses"
on public.responses for update to authenticated
using (exists (
  select 1 from public.participants p
  where p.id = responses.participant_id and p.user_id = (select auth.uid())
))
with check (exists (
  select 1 from public.participants p
  where p.id = responses.participant_id and p.session_id = responses.session_id
    and p.user_id = (select auth.uid())
));

create or replace function public.get_classroom_question(requested_session_id uuid, requested_position integer)
returns table (
  question_id text, prompt text, options jsonb, context text, question_type text,
  difficulty text, question_position integer, total integer
)
language plpgsql security invoker set search_path = ''
as $function$
begin
  if not exists (
    select 1 from public.classroom_sessions cs
    where cs.id = requested_session_id and (
      cs.owner_id = (select auth.uid())
      or exists (select 1 from public.participants p
        where p.session_id = cs.id and p.user_id = (select auth.uid()))
    )
  ) then raise exception 'classroom access denied'; end if;

  return query
  with available as (
    select q.question_id, q.prompt, q.options, q.context, q.question_type, q.difficulty,
      row_number() over (order by md5(q.question_id || requested_session_id::text))::integer - 1 as pos,
      count(*) over ()::integer as question_total
    from public.classroom_question_cards q
  )
  select available.question_id, available.prompt, available.options, available.context,
    available.question_type, available.difficulty, available.pos, available.question_total
  from available where available.pos = greatest(requested_position, 0);
end;
$function$;

create or replace function public.submit_classroom_answer(
  requested_session_id uuid, requested_question_id text,
  submitted_answer text, submitted_duration_ms integer default 0
)
returns table (is_correct boolean, rationale text, correct_answer text, answered_count bigint)
language plpgsql security invoker set search_path = ''
as $function$
declare
  current_participant_id uuid;
  answer_is_correct boolean;
begin
  select p.id into current_participant_id
  from public.participants p join public.classroom_sessions cs on cs.id = p.session_id
  where p.session_id = requested_session_id and p.user_id = (select auth.uid())
    and cs.status in ('lobby', 'active') and cs.expires_at > now() limit 1;
  if current_participant_id is null then raise exception 'classroom access denied'; end if;

  insert into public.responses (session_id, participant_id, question_id, answer, is_correct, duration_ms)
  values (requested_session_id, current_participant_id, requested_question_id,
    to_jsonb(submitted_answer), false, greatest(coalesce(submitted_duration_ms, 0), 0))
  on conflict (participant_id, question_id) do update set
    answer = excluded.answer, duration_ms = excluded.duration_ms, submitted_at = now()
  returning public.responses.is_correct into answer_is_correct;

  return query
  select answer_is_correct, feedback.rationale, feedback.correct_answer,
    (select count(*) from public.responses r where r.participant_id = current_participant_id)
  from public.question_feedback feedback where feedback.question_id = requested_question_id;
end;
$function$;
