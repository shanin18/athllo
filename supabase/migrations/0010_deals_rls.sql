-- `deals` had RLS enabled with no policy defined, so every query was denied
-- by default — dashboards always saw zero active deals regardless of data.
create policy deals_access on deals for all
  using (
    exists (select 1 from athlete_profiles a where a.id = athlete_id and a.user_id = auth.uid())
    or exists (select 1 from sponsor_profiles s where s.id = sponsor_id and s.user_id = auth.uid())
    or is_admin()
  )
  with check (
    exists (select 1 from athlete_profiles a where a.id = athlete_id and a.user_id = auth.uid())
    or exists (select 1 from sponsor_profiles s where s.id = sponsor_id and s.user_id = auth.uid())
    or is_admin()
  );
