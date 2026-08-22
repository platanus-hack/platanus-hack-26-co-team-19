# Next.js Better Auth Template

This directory (`web-ui/`) is the Next.js app. Run all Bun, Prisma, and Next commands from here.

Next.js App Router template with Better Auth, Prisma (multi-file schema), tRPC, Shadcn UI, Resend, and Minio.

## Tech stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Auth:** Better Auth
- **ORM / DB:** Prisma 7 + PostgreSQL 18
- **API:** tRPC
- **UI:** Shadcn UI, Tailwind CSS
- **Email / storage:** Resend, Minio
- **Lint / format:** Biome

## Prerequisites

- [Bun](https://bun.sh/)
- PostgreSQL
- Optional: Minio (object storage), Resend API key (transactional email)

## Setup

```bash
bun install
cp .env.example .env
# Fill in DATABASE_URL, BETTER_AUTH_SECRET, and any other services you use
bunx prisma migrate dev
bun dev
```

`bun dev` runs `prisma generate` and starts the Next.js development server.

### Environment variables

Copy `.env.example` to `.env`. Main values:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Auth encryption secret (min 32 chars; e.g. `openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | App base URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | Public app URL |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Email (optional until you send mail) |
| `MINIO_*` | Object storage (see `.env.example`) |

Env validation lives in `src/lib/config.ts`.

### Useful scripts

| Command | Description |
| --- | --- |
| `bun dev` | Generate Prisma client + start Next.js |
| `bun run build` / `bun run start` | Production build / serve |
| `bunx prisma generate` | Regenerate Prisma client |
| `bunx prisma migrate dev --name <name>` | Create and apply a migration |
| `bun run db:reset` | Reset the database |
| `bun run db:seed` | Seed the database |
| `bun run lint` / `bun run format` | Biome check / format |

## Prisma layout

This project uses a multi-file Prisma schema (`prisma.config.ts` sets `schema: "prisma/"`):

| Path | Role |
| --- | --- |
| `prisma/schema.prisma` | `generator` + `datasource` only |
| `prisma/models/auth.prisma` | Better Auth models (`User`, `Session`, `Account`, `Verification`) |
| `prisma/models/*.prisma` | Domain models (e.g. `marketing.prisma`) |
| `src/generated/prisma` | Generated client (import via `src/lib/prisma`) |

Do **not** put `generator` or `datasource` blocks in model files. Keep them in `prisma/schema.prisma`.

## Better Auth schema → `prisma/models/auth.prisma`

The Better Auth CLI defaults to writing into `prisma/schema.prisma`. In this repo you must target the auth models file only.

### 1. Generate schema

After changing Better Auth config or plugins in `src/lib/auth/index.ts`:

```bash
bunx @better-auth/cli@latest generate \
  --config ./src/lib/auth/index.ts \
  --output ./prisma/models/auth.prisma \
  --yes
```

Important:

- Use `--config ./src/lib/auth/index.ts` (there is no root `auth.ts`).
- Pass `--output` as the **file** `./prisma/models/auth.prisma`. If you pass a directory, the CLI may write a different filename.
- The command may overwrite `auth.prisma` — review the diff before migrating.
- Re-run `generate` whenever you add or change Better Auth plugins.

### 2. Apply to the database

```bash
bunx prisma migrate dev --name update_better_auth
```

For quick local prototyping without a migration file:

```bash
bunx prisma db push
```

### Flow

```text
src/lib/auth/index.ts
        │
        ▼
@better-auth/cli generate --output prisma/models/auth.prisma
        │
        ▼
prisma/models/auth.prisma  (+ schema.prisma + other models)
        │
        ▼
prisma migrate dev  →  src/generated/prisma
```

## Project structure (high level)

- `src/app/` — App Router pages and API routes (`/api/auth/[...all]`)
- `src/features/` — Feature modules
- `src/lib/` — Auth, Prisma, Resend, Minio, config
- `src/components/` — Shared UI (including Shadcn)
- `prisma/` — Schema, migrations, seed
- `docs/` — Extra documentation / PRDs

Import the Prisma client from `src/lib/prisma`, not from `@prisma/client` directly.
