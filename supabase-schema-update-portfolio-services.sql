-- Run this in your Supabase SQL Editor. Safe to run on top of everything
-- you've already run — it only adds new columns, nothing is deleted.

alter table profiles add column if not exists portfolio_link text default '';
alter table profiles add column if not exists services_offered text[] default '{}';
