-- Run this in your Supabase SQL Editor. It's safe to run even though you
-- already ran the first schema — it only adds new things, nothing is deleted.

-- 1. Store each user's email on their profile so we can reveal it once an
--    intro is accepted (kept in sync when they save their profile).
alter table profiles add column if not exists email text;

-- 2. The intro requests table itself.
create table if not exists intro_requests (
  id uuid default gen_random_uuid() primary key,
  requester_id uuid references auth.users on delete cascade not null,
  target_id uuid references auth.users on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz default now(),
  unique (requester_id, target_id)
);

alter table intro_requests enable row level security;

drop policy if exists "view own requests" on intro_requests;
create policy "view own requests"
  on intro_requests for select
  using (auth.uid() = requester_id or auth.uid() = target_id);

drop policy if exists "create own requests" on intro_requests;
create policy "create own requests"
  on intro_requests for insert
  with check (auth.uid() = requester_id);

drop policy if exists "target can respond" on intro_requests;
create policy "target can respond"
  on intro_requests for update
  using (auth.uid() = target_id);
