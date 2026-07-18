alter table athlete_profiles add column if not exists avatar_pos text default '50% 50%';
alter table athlete_profiles add column if not exists cover_pos text default '50% 50%';
alter table sponsor_profiles add column if not exists logo_pos text default '50% 50%';
alter table sponsor_profiles add column if not exists cover_pos text default '50% 50%';
