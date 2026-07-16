-- Allow the owner to update their own subscription row (needed for the
-- dummy/demo "upgrade plan" flow while Stripe isn't wired up; once Stripe
-- webhooks are live this should move to service-role-only writes).
create policy sub_update on subscriptions for update
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());
