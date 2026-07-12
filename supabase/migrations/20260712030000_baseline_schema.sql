create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.teacher_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  created_at timestamptz not null default now()
);

create table public.questions (
  id text primary key,
  type text not null check (type in ('term-match', 'context-match', 'relation', 'distinction', 'translation', 'application')),
  grade integer[] not null check (grade <@ array[7, 8, 9]),
  difficulty text not null check (difficulty in ('basic', 'intermediate', 'advanced')),
  prompt text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array'),
  correct_answers jsonb not null check (jsonb_typeof(correct_answers) = 'array'),
  metonym text not null,
  referent text not null,
  relation text not null,
  rationale text not null,
  context text not null default '',
  source jsonb,
  status text not null default 'draft' check (status in ('draft', 'pending-review', 'verified', 'published', 'disputed', 'disabled')),
  review_count integer not null default 0 check (review_count >= 0),
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.classroom_sessions (
  id uuid primary key default extensions.gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  code text not null unique check (code ~ '^[0-9]{6}$'),
  title text not null check (char_length(title) between 1 and 80),
  settings jsonb not null default '{}'::jsonb check (jsonb_typeof(settings) = 'object'),
  status text not null default 'lobby' check (status in ('lobby', 'active', 'closed')),
  expires_at timestamptz not null default (now() + interval '8 hours'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.participants (
  id uuid primary key default extensions.gen_random_uuid(),
  session_id uuid not null references public.classroom_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 24),
  joined_at timestamptz not null default now(),
  constraint participants_session_user_unique unique (session_id, user_id)
);

create table public.question_reviews (
  id uuid primary key default extensions.gen_random_uuid(),
  question_id text not null references public.questions(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  verdict text not null check (verdict in ('approved', 'rejected')),
  note text not null default '' check (char_length(note) <= 500),
  created_at timestamptz not null default now(),
  constraint question_reviews_question_reviewer_unique unique (question_id, reviewer_id),
  constraint rejected_review_requires_note check (verdict <> 'rejected' or char_length(btrim(note)) >= 4)
);

create table public.responses (
  id uuid primary key default extensions.gen_random_uuid(),
  session_id uuid not null references public.classroom_sessions(id) on delete cascade,
  participant_id uuid not null references public.participants(id) on delete cascade,
  question_id text not null references public.questions(id) on delete restrict,
  answer jsonb not null,
  is_correct boolean not null default false,
  duration_ms integer not null default 0 check (duration_ms >= 0),
  submitted_at timestamptz not null default now(),
  constraint responses_participant_question_unique unique (participant_id, question_id)
);

create index participants_user_id_idx on public.participants(user_id);
create index responses_session_id_idx on public.responses(session_id);
create index responses_participant_id_idx on public.responses(participant_id);
create index question_reviews_reviewer_id_idx on public.question_reviews(reviewer_id);

alter table public.teacher_profiles enable row level security;
alter table public.questions enable row level security;
alter table public.classroom_sessions enable row level security;
alter table public.participants enable row level security;
alter table public.question_reviews enable row level security;
alter table public.responses enable row level security;

revoke all on all tables in schema public from anon, authenticated;
grant select on public.teacher_profiles to authenticated;
grant select on public.questions to authenticated;
grant select, insert, update on public.classroom_sessions to authenticated;
grant select, insert on public.participants to authenticated;
grant select, insert on public.question_reviews to authenticated;
grant select, insert on public.responses to authenticated;
grant update (answer, duration_ms, submitted_at) on public.responses to authenticated;

create policy "users read own teacher profile"
on public.teacher_profiles for select to authenticated
using (user_id = (select auth.uid()));

create policy "approved teachers read questions"
on public.questions for select to authenticated
using (exists (
  select 1 from public.teacher_profiles tp where tp.user_id = (select auth.uid())
));

create policy "authenticated users find active classrooms"
on public.classroom_sessions for select to authenticated
using (
  (status in ('lobby', 'active') and expires_at > now())
  or owner_id = (select auth.uid())
);

create policy "teachers create own classrooms"
on public.classroom_sessions for insert to authenticated
with check (
  owner_id = (select auth.uid())
  and exists (select 1 from public.teacher_profiles tp where tp.user_id = (select auth.uid()))
);

create policy "teachers update own classrooms"
on public.classroom_sessions for update to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "students join active classrooms as themselves"
on public.participants for insert to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.classroom_sessions cs
    where cs.id = participants.session_id
      and cs.status in ('lobby', 'active') and cs.expires_at > now()
  )
);

create policy "participants and classroom owners read participants"
on public.participants for select to authenticated
using (
  user_id = (select auth.uid())
  or exists (
    select 1 from public.classroom_sessions cs
    where cs.id = participants.session_id and cs.owner_id = (select auth.uid())
  )
);

create policy "approved teachers read reviews"
on public.question_reviews for select to authenticated
using (exists (
  select 1 from public.teacher_profiles tp where tp.user_id = (select auth.uid())
));

create policy "approved teachers submit own reviews"
on public.question_reviews for insert to authenticated
with check (
  reviewer_id = (select auth.uid())
  and exists (select 1 from public.teacher_profiles tp where tp.user_id = (select auth.uid()))
);

create policy "students insert own responses"
on public.responses for insert to authenticated
with check (exists (
  select 1 from public.participants p
  join public.classroom_sessions cs on cs.id = p.session_id
  where p.id = responses.participant_id
    and p.session_id = responses.session_id
    and p.user_id = (select auth.uid())
    and cs.status in ('lobby', 'active') and cs.expires_at > now()
));

create policy "participants and classroom owners read responses"
on public.responses for select to authenticated
using (
  exists (select 1 from public.participants p
    where p.id = responses.participant_id and p.user_id = (select auth.uid()))
  or exists (select 1 from public.classroom_sessions cs
    where cs.id = responses.session_id and cs.owner_id = (select auth.uid()))
);

create or replace function private.set_updated_at()
returns trigger language plpgsql set search_path = '' as $function$
begin
  new.updated_at := now();
  return new;
end;
$function$;

create trigger set_questions_updated_at before update on public.questions
for each row execute function private.set_updated_at();
create trigger set_classroom_sessions_updated_at before update on public.classroom_sessions
for each row execute function private.set_updated_at();

create or replace function private.refresh_question_review_state()
returns trigger language plpgsql security definer set search_path = '' as $function$
declare
  approved_count integer;
  rejected_count integer;
begin
  select count(*) filter (where verdict = 'approved'), count(*) filter (where verdict = 'rejected')
  into approved_count, rejected_count
  from public.question_reviews where question_id = new.question_id;

  update public.questions
  set review_count = approved_count,
      status = case when rejected_count > 0 then 'disputed'
                    when approved_count >= 2 then 'published'
                    else 'pending-review' end
  where id = new.question_id;
  return new;
end;
$function$;

create trigger refresh_question_review_state after insert on public.question_reviews
for each row execute function private.refresh_question_review_state();

revoke all on all functions in schema private from public, anon, authenticated;
