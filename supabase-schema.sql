-- Run this once in your Supabase project's SQL Editor.
-- It creates the two tables Counterpart needs and locks them down
-- so people can only ever edit their own data.

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  role text not null check (role in ('business', 'manager')),
  niche text not null default '',
  budget numeric not null default 0,
  bio text default '',
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by any signed-in user"
  on profiles for select
  using (auth.role() = 'authenticated');

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create table if not exists saved_matches (
  user_id uuid references auth.users on delete cascade not null,
  matched_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default now(),
  primary key (user_id, matched_id)
);

alter table saved_matches enable row level security;

create policy "Users manage their own saved matches"
  on saved_matches for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
