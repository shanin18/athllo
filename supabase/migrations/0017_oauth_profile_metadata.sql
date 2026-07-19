create or replace function handle_new_user() returns trigger as $$
declare
  v_role user_role;
  v_slug text;
  v_name text;
  v_avatar text;
begin
  v_role := coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'athlete');
  v_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );
  v_avatar := new.raw_user_meta_data->>'avatar_url';

  insert into public.users (id, email, role)
  values (new.id, new.email, v_role);

  v_slug := lower(regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9]+', '-', 'g'))
    || '-' || substr(new.id::text, 1, 6);

  if v_role = 'sponsor' then
    insert into public.sponsor_profiles (user_id, slug, company_name, logo_url)
    values (new.id, v_slug, v_name, v_avatar);
  else
    insert into public.athlete_profiles (user_id, slug, display_name, avatar_url)
    values (new.id, v_slug, v_name, v_avatar);
  end if;

  insert into public.subscriptions (user_id, tier)
  values (new.id, 'free');

  return new;
end;
$$ language plpgsql security definer set search_path = public;
