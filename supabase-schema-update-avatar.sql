-- Run this in your Supabase SQL Editor (new query). Safe on top of
-- everything you've already run.

-- 1. Store the avatar's public URL on the profile.
alter table profiles add column if not exists avatar_url text default '';

-- 2. Create a public storage bucket for avatar images.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 3. Anyone can view avatars (they're public profile pictures).
drop policy if exists "Public read access to avatars" on storage.objects;
create policy "Public read access to avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- 4. People can only upload/replace/delete their OWN avatar — enforced by
--    requiring the file path to start with their own user id, e.g.
--    "34f2.../avatar.jpg".
drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
