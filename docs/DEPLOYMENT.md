# Deploying OrbitForm

OrbitForm is a Turborepo with two deployable apps:

| App | Path | Suggested host |
|-----|------|----------------|
| Web (Next.js 16) | `apps/web` | Vercel |
| API (Express + tRPC) | `apps/api` | Railway, Render, or Fly.io |

## Environment variables

Copy [`.env.example`](../.env.example) and set:

| Variable | App | Required |
|----------|-----|----------|
| `DATABASE_URL` | API, migrations | Yes |
| `SESSION_SECRET` | API | Yes (32+ chars) |
| `WEB_URL` | API | Yes (production web URL) |
| `BASE_URL` | API | Yes (production API URL) |
| `NEXT_PUBLIC_API_URL` | Web | `/trpc` (proxied) or full API `/trpc` URL |
| `API_INTERNAL_URL` | Web | Internal API URL for rewrites |
| `DEMO_OTP_CODE` | API | Optional (`000000` for demo login) |
| SMTP vars | API | Optional (emails log to console without SMTP) |

## Database

1. Provision PostgreSQL (Neon, Supabase, or Docker).
2. Run migrations and seed:

```bash
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm db:seed
```

## Vercel (web)

1. Import the repo and set **Root Directory** to `apps/web`.
2. Add environment variables (`API_INTERNAL_URL`, `NEXT_PUBLIC_API_URL`, etc.).
3. Deploy. Next.js rewrites proxy `/trpc`, `/docs`, and `/openapi.json` to the API when `API_INTERNAL_URL` is set.

## API host

Deploy `apps/api` with start command `pnpm start` (after `pnpm build` in that package).

Expose port from `PORT` (default `8000`). Set `WEB_URL` to your Vercel domain for CORS.

## Demo review

After deploy + seed:

- **Login:** `demo@orbitform.app` with OTP `000000` (when `DEMO_OTP_CODE=000000`)
- **Explore:** `/explore` — 3 public themed forms
- **Unlisted sample:** `/f/game-night-rsvp`
- **API docs:** `/docs` (Scalar)
