create unique index if not exists responses_participant_question_key
  on public.responses (participant_id, question_id);

create or replace function public.get_classroom_question(
  requested_session_id uuid,
  requested_position integer
)
returns table (
  question_id text,
  prompt text,
  options jsonb,
  context text,
  question_type text,
  difficulty text,
  question_position integer,
  total integer
)
language plpgsql
security definer
set search_path = ''
as $function$
declare
  permitted boolean;
begin
  if (select auth.uid()) is null then
    raise exception 'authentication required';
  end if;

  select exists (
    select 1
    from public.classroom_sessions cs
    where cs.id = requested_session_id
      and cs.expires_at > now()
      and (
        cs.owner_id = (select auth.uid())
        or exists (
          select 1
          from public.participants p
          where p.session_id = cs.id
            and p.user_id = (select auth.uid())
        )
      )
  ) into permitted;

  if not permitted then
    raise exception 'classroom access denied';
  end if;

  return query
  with available as (
    select
      q.id,
      q.prompt,
      q.options,
      q.context,
      q.type,
      q.difficulty,
      row_number() over (order by md5(q.id || requested_session_id::text))::integer - 1 as pos,
      count(*) over ()::integer as question_total
    from public.questions q
    where q.status in ('pending-review', 'published')
  )
  select
    available.id,
    available.prompt,
    available.options,
    available.context,
    available.type,
    available.difficulty,
    available.pos,
    available.question_total
  from available
  where available.pos = greatest(requested_position, 0);
end;
$function$;

create or replace function public.submit_classroom_answer(
  requested_session_id uuid,
  requested_question_id text,
  submitted_answer text,
  submitted_duration_ms integer default 0
)
returns table (
  is_correct boolean,
  rationale text,
  correct_answer text,
  answered_count bigint
)
language plpgsql
security definer
set search_path = ''
as $function$
declare
  current_participant_id uuid;
  question_row public.questions%rowtype;
  answer_is_correct boolean;
begin
  if (select auth.uid()) is null then
    raise exception 'authentication required';
  end if;

  select p.id
  into current_participant_id
  from public.participants p
  join public.classroom_sessions cs on cs.id = p.session_id
  where p.session_id = requested_session_id
    and p.user_id = (select auth.uid())
    and cs.status in ('lobby', 'active')
    and cs.expires_at > now()
  limit 1;

  if current_participant_id is null then
    raise exception 'classroom access denied';
  end if;

  select *
  into question_row
  from public.questions q
  where q.id = requested_question_id
    and q.status in ('pending-review', 'published');

  if question_row.id is null then
    raise exception 'question unavailable';
  end if;

  answer_is_correct := question_row.correct_answers @> jsonb_build_array(submitted_answer);

  insert into public.responses (
    session_id,
    participant_id,
    question_id,
    answer,
    is_correct,
    duration_ms
  )
  values (
    requested_session_id,
    current_participant_id,
    requested_question_id,
    to_jsonb(submitted_answer),
    answer_is_correct,
    greatest(coalesce(submitted_duration_ms, 0), 0)
  )
  on conflict (participant_id, question_id)
  do update set
    answer = excluded.answer,
    is_correct = excluded.is_correct,
    duration_ms = excluded.duration_ms,
    submitted_at = now();

  return query
  select
    answer_is_correct,
    question_row.rationale,
    question_row.correct_answers ->> 0,
    (
      select count(*)
      from public.responses r
      where r.participant_id = current_participant_id
    );
end;
$function$;

revoke all on function public.get_classroom_question(uuid, integer) from public;
revoke all on function public.get_classroom_question(uuid, integer) from anon;
grant execute on function public.get_classroom_question(uuid, integer) to authenticated;

revoke all on function public.submit_classroom_answer(uuid, text, text, integer) from public;
revoke all on function public.submit_classroom_answer(uuid, text, text, integer) from anon;
grant execute on function public.submit_classroom_answer(uuid, text, text, integer) to authenticated;
