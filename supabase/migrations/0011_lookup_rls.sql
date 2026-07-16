alter table sports enable row level security;
alter table industries enable row level security;

create policy sports_read on sports for select using (true);
create policy industries_read on industries for select using (true);
