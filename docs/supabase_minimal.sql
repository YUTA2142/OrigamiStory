-- Supabaseで「問題テーブルだけ」を作る最小構成
-- SQL Editorにそのまま貼り付けて実行してください

create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'cell_state' and n.nspname = 'public'
  ) then
    create type public.cell_state as enum (
      'empty',
      'square',
      'triangle-ne',
      'triangle-nw',
      'triangle-se',
      'triangle-sw'
    );
  end if;
end
$$;

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
  grid public.cell_state[4][4] not null,
  story text not null default '',
  created_at timestamptz not null default now(),
  constraint problems_grid_has_answer check (public.grid_has_non_empty(grid))
);

create index if not exists problems_created_at_desc_idx
  on public.problems (created_at desc);

alter table public.problems enable row level security;

-- 読み取りは公開（プレイ画面）
drop policy if exists "problems_select_public" on public.problems;
create policy "problems_select_public"
  on public.problems
  for select
  to anon, authenticated
  using (true);

-- 登録/更新/削除はログインユーザーのみ（管理画面）
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
