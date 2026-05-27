# Database (Supabase + Drizzle)

OrbitForm uses **Supabase Postgres** with **Drizzle ORM**. Migrations live in `packages/database/drizzle/`.

## 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Copy from **Project Settings → Database**:
   - Database password (set on create)
   - Connection strings for pooler (`6543`) and session (`5432`)

## 2. Local env (`apps/api/.env`)

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

In `apps/api/.env`, set (URL-encode special characters in the password):

```env
DATABASE_URL=postgresql://postgres.<ref>:<password>@<region>.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.<ref>:<password>@<region>.pooler.supabase.com:5432/postgres
```

## 3. Run migrations

```bash
pnpm install
pnpm db:migrate
```

Creates: `users`, `email_otps`, `sessions`, `forms`, `form_submissions`.

Optional demo data (local only):

```bash
pnpm db:seed
```

## 4. Tables

| Table | Purpose |
|-------|---------|
| `users` | Accounts |
| `email_otps` | OTP codes (hashed) |
| `sessions` | Login sessions |
| `forms` | Form documents |
| `form_submissions` | Responses |

Backup SQL: `supabase/migrations/20260526120000_orbitform_initial_schema.sql` (Supabase SQL editor).
