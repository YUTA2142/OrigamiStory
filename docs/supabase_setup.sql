-- OrigamiStory: Supabase schema + RLS setup
-- Run in Supabase SQL Editor

create extension if not exists pgcrypto;

-- 4x4 grid states used by app.js
create type public.cell_state as enum (
  'empty',
  'square',
  'triangle-ne',
  'triangle-nw',
  'triangle-se',
  'triangle-sw'
);

-- CHECK 制約内で直接 subquery は使えないため、関数経由で検証する
create or replace function public.grid_has_non_empty(grid_input public.cell_state[][])
returns boolean
language sql
immutable
as $$
  select exists (
    select 1
    from unnest(grid_input) as r
    where r <> 'empty'::public.cell_state
  );
$$;

create table if not exists public.problems (
  id uuid primary key default gen_random_uuid(),
  svg text not null,
  grid cell_state[4][4] not null,
  story text not null default '',
  story_en text not null default '',
  created_at timestamptz not null default now(),

  -- empty only is not allowed; at least one non-empty cell required
  constraint problems_grid_has_answer check (public.grid_has_non_empty(grid))
);

create index if not exists problems_created_at_desc_idx
  on public.problems (created_at desc);

-- Optional: audit table for answer submissions (if you later want analytics)
create table if not exists public.answer_attempts (
  id bigint generated always as identity primary key,
  problem_id uuid not null references public.problems(id) on delete cascade,
  submitted_grid cell_state[4][4] not null,
  is_correct boolean not null,
  submitted_at timestamptz not null default now()
);

create index if not exists answer_attempts_problem_id_idx
  on public.answer_attempts (problem_id);

-- Enable RLS
alter table public.problems enable row level security;
alter table public.answer_attempts enable row level security;

-- Public can read problems (solve screen)
drop policy if exists "problems_select_public" on public.problems;
create policy "problems_select_public"
  on public.problems
  for select
  to anon, authenticated
  using (true);

-- Only authenticated users can insert/update/delete problems.
-- (Map this to admin users in your app logic)
drop policy if exists "problems_insert_auth" on public.problems;
create policy "problems_insert_auth"
  on public.problems
  for insert
  to authenticated
  with check (true);

drop policy if exists "problems_update_auth" on public.problems;
create policy "problems_update_auth"
  on public.problems
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "problems_delete_auth" on public.problems;
create policy "problems_delete_auth"
  on public.problems
  for delete
  to authenticated
  using (true);

-- Attempts: anyone can insert (optional), only authenticated can read.
drop policy if exists "attempts_insert_public" on public.answer_attempts;
create policy "attempts_insert_public"
  on public.answer_attempts
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "attempts_select_auth" on public.answer_attempts;
create policy "attempts_select_auth"
  on public.answer_attempts
  for select
  to authenticated
  using (true);
