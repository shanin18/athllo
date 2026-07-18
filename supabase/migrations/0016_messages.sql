create table messages (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references inquiries(id) on delete cascade,
  sender_id uuid not null references users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index idx_messages_inquiry on messages (inquiry_id, created_at);

alter table messages enable row level security;

create policy messages_access on messages for select
  using (
    exists (
      select 1 from inquiries i
      where i.id = messages.inquiry_id
        and (i.sender_id = auth.uid() or i.recipient_id = auth.uid())
    ) or is_admin()
  );

create policy messages_insert on messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from inquiries i
      where i.id = messages.inquiry_id
        and (i.sender_id = auth.uid() or i.recipient_id = auth.uid())
    )
  );

alter publication supabase_realtime add table messages;
