# OrbitForm

Production-style form builder SaaS on Turborepo, tRPC, Zod, Drizzle ORM, and Scalar.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (`apps/web`) |
| Backend | Express + tRPC (`apps/api`) |
| Database | PostgreSQL + Drizzle (`packages/database`) |
| Validation | Zod (`packages/form-schema`) |
| API docs | Scalar at `/docs` |

## Quick start

```bash
pnpm install
cp .env.example .env
pnpm setup    # Docker Postgres + migrate + seed
pnpm dev      # web :3000 + api :8000
```

See [docs/DATABASE.md](docs/DATABASE.md) and [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## URLs (local)

| Service | URL |
|---------|-----|
| Web | http://localhost:3000 |
| API | http://localhost:8000 |
| API docs (Scalar) | http://localhost:3000/docs or http://localhost:8000/docs |

## Demo credentials

After `pnpm db:seed`:

| Field | Value |
|-------|-------|
| Email | `demo@orbitform.app` |
| OTP | `000000` (set `DEMO_OTP_CODE=000000` in `.env`) |

Without SMTP, OTP codes also print in the API terminal.

### Sample forms (pre-seeded)

| Form | Slug | Visibility |
|------|------|------------|
| Anime Fan Survey | `/f/anime-fan-survey` | Public (explore) |
| Startup Waitlist | `/f/startup-waitlist` | Public (explore) |
| OS Preference Poll | `/f/os-preference-poll` | Public (explore) |
| Game Night RSVP | `/f/game-night-rsvp` | Unlisted |

Each includes seeded responses for analytics charts in the builder **Entries** tab.

## Authentication

Email OTP: `/signup`, `/login`, `/verify-otp`. Session cookie `orbit_session` protects `/dashboard/*`.

## Features

- Creator dashboard with form builder (9 field types, validation, grid layout)
- Publish / unpublish, public vs unlisted visibility
- Public form filling without login (`/f/[slug]`)
- Explore page for public forms
- Response analytics, CSV export, rate-limited public submit
- Theme presets on live public forms
- Template gallery with real field seeding
- Email notifications (creator + respondent, when SMTP configured)

## Project structure

```
apps/
  web/                 # Next.js frontend
  api/                 # Express + tRPC + Scalar
packages/
  auth/                # OTP schemas & constants
  database/            # Drizzle schema & migrations
  form-schema/         # Zod form document & dynamic validation
  trpc/                # Shared tRPC routers
  services/            # Auth, forms, submissions, analytics, email
  logger/
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start web + API |
| `pnpm db:migrate` | Run Drizzle migrations |
| `pnpm db:seed` | Seed demo user, forms, responses |
| `pnpm setup` | DB up + migrate + seed |

## API documentation

OpenAPI is generated from tRPC via `trpc-to-openapi`. Browse interactive docs at `/docs` (Scalar).

Routers: `health`, `auth`, `forms` (protected), `publicForms` (public submit + explore).

## License

Private — hackathon / portfolio use.
