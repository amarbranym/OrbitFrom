# OrbitForm

Production-style form builder SaaS on Turborepo, tRPC, Zod, Drizzle ORM, and Supabase Postgres.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (`apps/web`) → **Vercel** |
| Backend | Express + tRPC (`apps/api`) → **Railway / Render** |
| Database | **Supabase** Postgres + Drizzle (`packages/database`) |
| Validation | Zod (`packages/form-schema`) |
| API docs | Scalar at `/docs` |

## Quick start (local)

```bash
pnpm install
cp .env.example .env
# Edit .env: Supabase DATABASE_URL, DIRECT_URL, SESSION_SECRET, etc.
pnpm db:migrate
pnpm dev
```

- Web: http://localhost:3000  
- API: http://localhost:8000  

Optional demo data: `pnpm db:seed`

## Deploy to production

**Step-by-step:** [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) (Vercel + Supabase + API host)

**Database:** [docs/DATABASE.md](docs/DATABASE.md)

## URLs (local)

| Service | URL |
|---------|-----|
| Web | http://localhost:3000 |
| API | http://localhost:8000 |
| API docs (Scalar) | http://localhost:3000/docs |

## Demo credentials

After `pnpm db:seed`:

| Field | Value |
|-------|-------|
| Email | `demo@orbitform.app` |
| OTP | `000000` (set `DEMO_OTP_CODE=000000` in `.env`) |

## Authentication

Email OTP: `/signup`, `/login`, `/verify-otp`. Session cookie `orbit_session` protects `/dashboard/*`.

## Project structure

```
apps/
  web/                 # Next.js frontend
  api/                 # Express + tRPC + Scalar
packages/
  auth/                # OTP schemas & constants
  database/            # Drizzle schema & migrations
  form-schema/         # Zod form document & validation
  trpc/                # Shared tRPC routers
  services/            # Auth, forms, submissions, analytics, email
  logger/
supabase/              # Supabase CLI config + SQL backup migrations
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start web + API |
| `pnpm db:migrate` | Run Drizzle migrations (Supabase) |
| `pnpm db:seed` | Seed demo user, forms, responses |
| `pnpm setup` | Run migrations only (`db:migrate`) |
| `pnpm build` | Production build (Turbo) |

## License

Private — hackathon / portfolio use.
