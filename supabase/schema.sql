create table if not exists public.landing_leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.landing_leads enable row level security;

-- Inserts are performed from the Next.js API route with SUPABASE_SERVICE_ROLE_KEY.
-- Keep browser clients blocked by default.
