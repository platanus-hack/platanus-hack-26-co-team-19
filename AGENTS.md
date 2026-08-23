# Project: Next.js Better Auth Template

The Next.js app lives in `web-ui/`. Run Bun, Prisma, and Next from that directory.

Next.js App Router template with Better Auth, Prisma (multi-file schema), tRPC, Shadcn UI, Resend, and Minio.

## Tech Stack

From `web-ui/package.json` (pin to repo versions when upgrading):

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Auth:** Better Auth
- **ORM / DB:** Prisma 7 + PostgreSQL (`@prisma/adapter-pg`, `@prisma/adapter-neon`)
- **API:** tRPC 11 + TanStack Query
- **Forms / validation:** TanStack Form + Zod 4
- **UI:** Shadcn UI (Radix) + Tailwind CSS 4
- **Email / storage:** Resend + Minio
- **Lint / format:** Biome 2
- **Runtime / package manager:** Bun

## Project Structure

- `web-ui/src/app/` — App Router pages and API routes (`/api/auth/[...all]`, tRPC)
- `web-ui/src/features/` — Feature modules (schemas, hooks, components)
- `web-ui/src/lib/` — Auth, Prisma, Resend, Minio, config, tRPC
- `web-ui/src/components/` — Shared UI (including Shadcn `ui/`)
- `web-ui/src/generated/prisma` — Generated Prisma client
- `web-ui/prisma/` — Multi-file schema, migrations, seed/reset
- `docs/` — Extra documentation / PRDs

### Prisma layout (`web-ui/prisma.config.ts` → `schema: "prisma/"`)

| Path | Role |
| --- | --- |
| `web-ui/prisma/schema.prisma` | `generator` + `datasource` only (`schemas = ["public", "corte"]`) |
| `web-ui/prisma/models/auth.prisma` | Better Auth models (`@@schema("public")`) |
| `web-ui/prisma/models/chat.prisma` | Chat models (`@@schema("public")`) |
| `web-ui/prisma/models/marketing.prisma` | Marketing models (`@@schema("public")`) |
| `web-ui/prisma/models/corte.prisma` | Introspected Consejo de Estado tables (`@@schema("corte")`) |
| `web-ui/prisma/migrations/` | Migration history **for `public` only** |
| `web-ui/src/generated/prisma` | Generated client |

Do **not** put `generator` or `datasource` in model files.

Postgres has two schemas on the same `DATABASE_URL`:

- **`public`**: app tables (Better Auth, chat, contact). Owned by Prisma migrations.
- **`corte`**: scraping/MCP (`providencias`, `votos`, `descriptores`, `firmantes`, `problemas`, `jueces_perfiles`, view `perfiles`). DDL is owned by scraping/Postgres. Refresh models with `bunx prisma db pull` from `web-ui/` and re-split into `corte.prisma`. Do **not** `migrate dev` to create or drop `corte` tables. Most `corte` tables have no PK and are `@@ignore` (not queryable via Prisma Client). The `perfiles` view is not modeled so Prisma does not emit `CREATE TABLE`.

After Better Auth CLI generate, re-add `@@schema("public")` on each auth model.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/)
- PostgreSQL
- Optional: Minio, Resend API key

### Install and run

```bash
cd web-ui
bun install
cp .env.example .env
# Fill DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, NEXT_PUBLIC_APP_URL, etc.
bunx prisma migrate dev
bun dev
```

Env validation: `web-ui/src/lib/config.ts`.

`bun install` runs `postinstall` → `prisma generate`.  
`bun dev` runs `prisma generate && next dev`.

## Scripts (`web-ui/package.json`)

| Command | What it does |
| --- | --- |
| `bun install` | Install deps + `prisma generate` (postinstall) |
| `bun dev` | `prisma generate` + Next.js dev server |
| `bun run build` | `next build` |
| `bun run start` | `next start` |
| `bun run lint` | `biome check` |
| `bun run format` | `biome format --write` |
| `bun run db:reset` | `tsx prisma/reset.ts` |
| `bun run db:seed` | `prisma db seed` (seed: `tsx prisma/seed.ts`) |

## Migrations, generation, and schema updates

Commands below assume `cwd` is `web-ui/`.

### Prisma client

```bash
bunx prisma generate
```

Also runs automatically on `bun install` and `bun dev`.

### Create / apply migrations

```bash
bunx prisma migrate dev --name <migration_name>
```

First-time / catch-up:

```bash
bunx prisma migrate dev
```

Prototype without a migration file (local only):

```bash
bunx prisma db push
```

### Seed / reset

```bash
bun run db:seed
bun run db:reset
```

### Better Auth → `prisma/models/auth.prisma`

After changing Better Auth config or plugins in `src/lib/auth/index.ts`:

```bash
bunx @better-auth/cli@latest generate \
  --config ./src/lib/auth/index.ts \
  --output ./prisma/models/auth.prisma \
  --yes
```

Then apply DB changes:

```bash
bunx prisma migrate dev --name update_better_auth
```

Important:

- Config path is `./src/lib/auth/index.ts` (no root `auth.ts`).
- `--output` must be the **file** `./prisma/models/auth.prisma` (not a directory).
- Review the diff; `generate` may overwrite `auth.prisma`.
- Re-run generate whenever you add or change Better Auth plugins.

Flow:

```text
web-ui/src/lib/auth/index.ts
        │
        ▼
@better-auth/cli generate --output prisma/models/auth.prisma
        │
        ▼
web-ui/prisma/models/auth.prisma (+ schema.prisma + other models)
        │
        ▼
prisma migrate dev  →  prisma generate  →  web-ui/src/generated/prisma
```

## Development Conventions

- **Code style:** Biome via `bun run lint` / `bun run format` (from `web-ui/`).
- **UI:** Follow Shadcn UI patterns for new components.
- **Validation:** Zod 4 in feature schemas and env config.
- **Auth:** Server `auth` / client `authClient` from `src/lib/`.
- **Prisma:** Import from `src/lib/prisma`, never `@prisma/client` or `src/generated/prisma` directly in app code.
- **API:** Prefer existing tRPC + TanStack Query patterns under `src/features/` and `src/lib/`.
