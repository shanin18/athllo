-- Allow the owner to insert their own subscription row (needed so the
-- dummy "upgrade plan" flow can upsert for accounts that predate the
-- auto-provisioning trigger, or never got a row for any other reason).
create policy sub_insert on subscriptions for insert
  with check (user_id = auth.uid() or is_admin());
