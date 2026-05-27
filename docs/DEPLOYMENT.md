# Deploy OrbitForm (Vercel + Supabase)

OrbitForm is a **Turborepo** with two runtime apps:

| App | Path | Host |
|-----|------|------|
| **Web** (Next.js) | `apps/web` | **Vercel** |
| **API** (Express + tRPC) | `apps/api` | **Vercel** or **Railway / Render** |
| **Database** | — | **Supabase** |

The web app proxies `/trpc` to the API via `API_INTERNAL_URL`.

---

## Environment files (local)

| File | Purpose |
|------|---------|
| `apps/api/.env.example` | API, database, auth, email |
| `apps/web/.env.example` | Next.js client URL + server rewrite target |

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

---

## Part 1 — Supabase (database)

### 1.1 Create project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**.
2. Save the **database password** (you need it for connection strings).

### 1.2 Run migrations (once)

On your machine, with `apps/api/.env` filled in (see [DATABASE.md](./DATABASE.md)):

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

Set both in the **API** Vercel project (or Railway), not on web.

---

## Part 2 — API

Deploy `apps/api` first so you have a public API URL for Vercel web rewrites.

### 2.1 Vercel (recommended if both apps are on Vercel)

1. [vercel.com/new](https://vercel.com/new) → import repo → **Root Directory:** `apps/api`.
2. Enable **Include source files outside of the Root Directory**.
3. Set environment variables from `apps/api/.env.example` (Production + Preview):

| Variable | Example | Required |
|----------|---------|----------|
| `DATABASE_URL` | Supabase pooler URL (`6543`, `pgbouncer=true`) | Yes |
| `SESSION_SECRET` | `openssl rand -base64 32` | Yes |
| `NODE_ENV` | `production` | Yes |
| `BASE_URL` | `https://your-api.vercel.app` | Yes |
| `WEB_URL` | `https://your-web.vercel.app` | Yes |
| `SMTP_*` | Gmail / Resend / etc. | Optional |
| `DEMO_OTP_CODE` | `000000` | Optional (demo only) |

4. Deploy and note the API URL (no trailing slash).

### 2.2 Railway / Render (alternative)

| Setting | Value |
|---------|--------|
| **Build command** | `pnpm install && pnpm turbo build --filter=@repo/api` |
| **Start command** | `node apps/api/dist/index.js` |

Use the same env vars as above; set `BASE_URL` to the public host URL.

---

## Part 3 — Web (Vercel)

### 3.1 Import repository

1. [vercel.com/new](https://vercel.com/new) → import your GitHub repo.
2. **Framework Preset:** Next.js.
3. **Root Directory:** `apps/web`.
4. **Include source files outside of the Root Directory:** **Enabled**.

### 3.2 Web environment variables

Project → **Settings → Environment Variables** (Production + Preview):

| Variable | Value | Notes |
|----------|--------|--------|
| `NEXT_PUBLIC_API_URL` | `/trpc` | Browser uses same-origin `/trpc` |
| `API_INTERNAL_URL` | `https://your-api.vercel.app` | **No** trailing slash |

Do **not** put `DATABASE_URL`, `SESSION_SECRET`, or `SMTP_*` on the web project — those belong on the API only.

The web app rewrites `/trpc/*` → `API_INTERNAL_URL/trpc/*` (see `apps/web/next.config.js`).

### 3.3 Deploy

1. Deploy web after the API is live.
2. Set API `WEB_URL` to your web production URL (exact origin, no trailing slash).
3. Redeploy API if you changed `WEB_URL`.
4. Test login, builder, and a public form `/f/<slug>`.

---

## Part 4 — Post-deploy checklist

- [ ] `pnpm db:migrate` ran against production Supabase (`DIRECT_URL` in local `apps/api/.env`)
- [ ] API health: `https://<api-url>/` → `{ message: "OrbitForm API is running" }`
- [ ] Web → signup/login (OTP email or `DEMO_OTP_CODE` on API)
- [ ] Create/publish a form; open `/f/<slug>`
- [ ] API `WEB_URL` matches the exact web origin (fixes CORS on login)

---

## Environment variable reference

| Variable | Web (Vercel) | API |
|----------|:------------:|:---:|
| `DATABASE_URL` | No | Yes |
| `DIRECT_URL` | No | Local migrations only |
| `SESSION_SECRET` | No | Yes |
| `WEB_URL` | No | Yes |
| `BASE_URL` | No | Yes |
| `NEXT_PUBLIC_API_URL` | Yes (`/trpc`) | No |
| `API_INTERNAL_URL` | Yes | No |
| `SMTP_*` | No | Optional |
| `DEMO_OTP_CODE` | No | Optional |

---

## Local development

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
pnpm db:migrate
pnpm dev
```

- Web: http://localhost:3000  
- API: http://localhost:8000  

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `password authentication failed` | Check Supabase password in `apps/api/.env`; URL-encode special chars |
| tRPC fails on Vercel | `API_INTERNAL_URL` must be the public API URL; redeploy web after API is live |
| CORS / OPTIONS 500 on login | API `WEB_URL` must match the exact web URL (scheme + host) |
| OTP not received | Configure `SMTP_*` on the API; or use `DEMO_OTP_CODE` for demos |
| Tables missing | Run `pnpm db:migrate` locally with `DIRECT_URL` in `apps/api/.env` |
