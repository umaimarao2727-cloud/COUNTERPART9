-- Run this in your Supabase SQL Editor (new query). Safe on top of everything
-- you've already run.

alter table profiles add column if not exists accepting_clients boolean not null default true;
