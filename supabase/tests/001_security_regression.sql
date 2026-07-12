begin;

-- Run after all migrations with a privileged psql connection. The script rolls
-- back fixtures and raises an exception on the first failed security invariant.

do $test$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.responses'::regclass
      and contype = 'u'
      and pg_get_constraintdef(oid) = 'UNIQUE (participant_id, question_id)'
  ) then
    raise exception 'responses must retain a participant/question unique constraint';
  end if;

  if exists (
    select 1 from information_schema.role_table_grants
    where table_schema = 'public' and grantee = 'anon'
      and privilege_type in ('INSERT', 'UPDATE', 'DELETE')
  ) then
    raise exception 'anon must not have public table mutation grants';
  end if;

  if exists (
    select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity
      and c.relname in ('teacher_profiles','questions','classroom_sessions','participants','question_reviews','responses','classroom_question_cards','question_feedback')
  ) then
    raise exception 'all application tables must have RLS enabled';
  end if;

  if has_column_privilege('authenticated', 'public.responses', 'participant_id', 'UPDATE')
     or has_column_privilege('authenticated', 'public.responses', 'session_id', 'UPDATE')
     or has_column_privilege('authenticated', 'public.responses', 'question_id', 'UPDATE')
     or has_column_privilege('authenticated', 'public.responses', 'is_correct', 'UPDATE') then
    raise exception 'authenticated users can update protected response columns';
  end if;

  if not has_column_privilege('authenticated', 'public.responses', 'answer', 'UPDATE')
     or not has_column_privilege('authenticated', 'public.responses', 'duration_ms', 'UPDATE') then
    raise exception 'answer retry columns are not updateable';
  end if;
end
$test$;

-- Supabase auth.uid() reads request.jwt.claim.sub. Fixed UUIDs make the attacker
-- matrix deterministic without creating auth.users rows.
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000099', true);

do $attacker$
begin
  if exists (select 1 from public.questions) then
    raise exception 'unapproved authenticated user can read protected questions';
  end if;
  if exists (select 1 from public.question_reviews) then
    raise exception 'unapproved authenticated user can read teacher reviews';
  end if;
  if exists (select 1 from public.question_feedback) then
    raise exception 'user without a response can read answer feedback';
  end if;
end
$attacker$;

reset role;
rollback;
