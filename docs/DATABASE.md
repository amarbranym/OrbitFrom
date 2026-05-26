# PostgreSQL setup

OrbitForm uses **PostgreSQL** with Drizzle ORM. Recommended: **Docker** (matches `.env` credentials).

## Option A — Docker (recommended)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose).

```bash
# Start Postgres (postgres / postgres, database: dev)
pnpm db:up

# Apply migrations
pnpm db:migrate

# Run app
pnpm dev
```

**One-shot setup:**

```bash
pnpm setup   # db:up + db:migrate
pnpm dev
```

**Stop database:**

```bash
pnpm db:down
```

Default connection (in `.env`):

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5434/dev
```

Docker maps host port **5434** → container `5432` (avoids conflict with local Postgres on `5432`).

---

## Option B — Local PostgreSQL (no Docker)

Install Postgres locally and create `dev`:

```bash
createdb dev
```

Set `DATABASE_URL` in `.env` to your user/password. See comments in `.env.example`.

```bash
pnpm db:migrate
pnpm dev
```

---

## Tables (auth)

| Table | Purpose |
|-------|---------|
| `users` | Accounts |
| `email_otps` | OTP codes (hashed) |
| `sessions` | Login sessions |

Migrations live in `packages/database/drizzle/`.
