# Vercel + Next.js + Supabase landing page

Minimal flow:

1. Create a Supabase project.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. Copy `.env.example` to `.env.local` and fill in:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Install and run locally:

```bash
corepack enable
pnpm install
pnpm dev
```

Open `http://localhost:3000`, submit the form, then check the
`landing_leads` table in Supabase.

## Deploy to Vercel

```bash
pnpm dlx vercel
```

In Vercel Project Settings -> Environment Variables, add:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

Redeploy after adding the variables. The landing page posts to
`/api/leads`, and that API route writes into Supabase.
