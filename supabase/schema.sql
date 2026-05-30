create table if not exists public.landing_leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.landing_leads enable row level security;

drop policy if exists "Allow public lead inserts" on public.landing_leads;

create policy "Allow public lead inserts"
  on public.landing_leads
  for insert
  to anon, authenticated
  with check (
    email is not null
    and position('@' in email) > 1
  );

-- Public clients can only insert leads. No select/update/delete policy is
-- defined, so submitted leads remain unreadable from browser clients.
