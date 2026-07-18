alter table athlete_profiles add column if not exists avatar_url text;
alter table athlete_profiles add column if not exists cover_url text;
alter table sponsor_profiles add column if not exists cover_url text;

insert into storage.buckets (id, name, public)
values ('profile-media', 'profile-media', true)
on conflict (id) do nothing;

create policy "profile-media public read" on storage.objects
  for select using (bucket_id = 'profile-media');

create policy "profile-media owner insert" on storage.objects
  for insert with check (bucket_id = 'profile-media' and owner = auth.uid());

create policy "profile-media owner update" on storage.objects
  for update using (bucket_id = 'profile-media' and owner = auth.uid());

create policy "profile-media owner delete" on storage.objects
  for delete using (bucket_id = 'profile-media' and owner = auth.uid());
