# Deploy OrbitForm (Vercel + Supabase)

OrbitForm is a **Turborepo** with two runtime apps:

| App | Path | Host |
|-----|------|------|
| **Web** (Next.js) | `apps/web` | **Vercel** |
| **API** (Express + tRPC) | `apps/api` | **Railway** or **Render** (long-running Node) |
| **Database** | — | **Supabase** |

Vercel runs the Next.js frontend. The API must run on a Node host (Express is not a Vercel serverless function in this repo). The web app proxies `/trpc` to the API via `API_INTERNAL_URL`.

---

## Part 1 — Supabase (database)

### 1.1 Create project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**.
2. Save the **database password** (you need it for connection strings).

### 1.2 Run migrations (once)

On your machine, with `.env` filled in (see [DATABASE.md](./DATABASE.md)):

```bash
pnpm install
pnpm db:migrate
```

Skip `pnpm db:seed` for production unless you want demo data.

### 1.3 Connection strings

From **Settings → Database → Connection string**:

| Use | Port | Env var |
|-----|------|---------|
| App / API runtime | `6543` (Transaction pooler, `?pgbouncer=true`) | `DATABASE_URL` |
| Migrations (CLI only) | `5432` (Session pooler) | `DIRECT_URL` |

---

## Part 2 — API (Railway recommended)

Deploy `apps/api` first so you have a public API URL for Vercel rewrites.

### 2.1 Create Railway project

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**.
2. Select this repository.

### 2.2 Service settings

| Setting | Value |
|---------|--------|
| **Root directory** | `/` (repo root) |
| **Build command** | `pnpm install && pnpm turbo build --filter=@repo/api` |
| **Start command** | `node apps/api/dist/index.js` |

Enable **Watch paths** or monorepo support if Railway offers it for `apps/api` and `packages/**`.

### 2.3 API environment variables

Set in Railway → **Variables**:

| Variable | Example | Required |
|----------|---------|----------|
| `DATABASE_URL` | Supabase pooler URL (`6543`, `pgbouncer=true`) | Yes |
| `SESSION_SECRET` | `openssl rand -base64 32` | Yes |
| `NODE_ENV` | `prod` | Yes |
| `BASE_URL` | `https://your-api.up.railway.app` | Yes |
| `WEB_URL` | `https://your-app.vercel.app` | Yes |
| `PORT` | `8000` (Railway often sets `PORT` automatically) | Often auto |
| `SMTP_*` | Gmail / Resend / etc. | Optional |
| `DEMO_OTP_CODE` | `000000` | Optional (demo only) |

### 2.4 Deploy API

1. Deploy and wait for a successful build.
2. Open **Settings → Networking → Generate domain** (e.g. `https://orbitform-api-production.up.railway.app`).
3. Set `BASE_URL` to that URL (no trailing slash).
4. Redeploy if you changed `BASE_URL` after the first deploy.

**Render alternative:** New Web Service → same build/start commands, add env vars, use the `.onrender.com` URL as `BASE_URL`.

---

## Part 3 — Web (Vercel)

### 3.1 Import repository

1. [vercel.com/new](https://vercel.com/new) → import your GitHub repo.
2. **Framework Preset:** Next.js.

### 3.2 Monorepo settings

| Setting | Value |
|---------|--------|
| **Root Directory** | `apps/web` |
| **Include source files outside of the Root Directory** | **Enabled** |

`apps/web/vercel.json` already sets install/build for the monorepo:

- Install: `cd ../.. && pnpm install`
- Build: `cd ../.. && pnpm turbo build --filter=web`

### 3.3 Vercel environment variables

Project → **Settings → Environment Variables** (Production + Preview):

| Variable | Value | Notes |
|----------|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | From Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` | From Supabase |
| `NEXT_PUBLIC_API_URL` | `/trpc` | Keep as `/trpc` (browser uses same origin) |
| `API_INTERNAL_URL` | `https://your-api.up.railway.app` | **No** trailing slash |
| `DATABASE_URL` | Supabase pooler URL | Only if a Server Action reads DB later |
| `SESSION_SECRET` | Same as API | Only if needed on web |
| `WEB_URL` | `https://your-app.vercel.app` | Production canonical URL |

The web app rewrites `/trpc/*` → `API_INTERNAL_URL/trpc/*` (see `apps/web/next.config.js`).

### 3.4 Deploy

1. Click **Deploy**.
2. After deploy, open `https://<your-vercel-domain>/`.
3. Test login, builder, and a public form `/f/<slug>`.

### 3.5 Custom domain (optional)

1. Vercel → **Domains** → add your domain.
2. Update Railway `WEB_URL` and any `GOOGLE_OAUTH_REDIRECT_URI` to the new domain.
3. Redeploy API.

---

## Part 4 — Post-deploy checklist

- [ ] `pnpm db:migrate` ran against production Supabase (`DIRECT_URL` in local `.env`)
- [ ] API health: open `https://<api-url>/` → JSON `{ message: "OrbitForm API is running" }`
- [ ] Web → signup/login (OTP email or `DEMO_OTP_CODE`)
- [ ] Create/publish a form; open `/f/<slug>`
- [ ] `/explore` shows public forms (if any exist)
- [ ] API docs: `https://<vercel-domain>/docs` (proxied to API)

---

## Environment variable reference

See [`.env.example`](../.env.example) for the full list.

| Variable | Web (Vercel) | API (Railway) |
|----------|:------------:|:-------------:|
| `DATABASE_URL` | Optional* | Yes |
| `DIRECT_URL` | No | No (migrate from laptop/CI) |
| `SESSION_SECRET` | Optional* | Yes |
| `WEB_URL` | Recommended | Yes |
| `BASE_URL` | No | Yes |
| `NEXT_PUBLIC_API_URL` | Yes (`/trpc`) | No |
| `API_INTERNAL_URL` | Yes | No |
| `NEXT_PUBLIC_SUPABASE_*` | Yes | No |

\*Web talks to the API via tRPC; DB is used on the API. Web only needs DB env if you add server-side DB code later.

---

## Local development (no Docker)

```bash
pnpm install
cp .env.example .env
# Fill Supabase DATABASE_URL, DIRECT_URL, SESSION_SECRET, etc.
pnpm db:migrate
pnpm dev
```

- Web: http://localhost:3000  
- API: http://localhost:8000  

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `password authentication failed` | Check Supabase password; URL-encode special chars in `DATABASE_URL` |
| tRPC fails on Vercel | `API_INTERNAL_URL` must be the public Railway URL; redeploy web after API is live |
| CORS errors | API `WEB_URL` must match the exact Vercel URL (scheme + host) |
| OTP not received | Configure `SMTP_*` on the API host; or use `DEMO_OTP_CODE` for demos |
| Tables missing | Run `pnpm db:migrate` locally with `DIRECT_URL` pointing at Supabase |
