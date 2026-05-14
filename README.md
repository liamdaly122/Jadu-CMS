# Jadu-CMS

Staging editor for JADU document pages with a pixel-accurate live preview
using the University of Leeds design system. Author here, copy the rendered
HTML, paste into JADU's CKEditor Source view.

See `PLAN.md` and `docs/uol-component-map.md` for the full design.

## Local development

```bash
pnpm install
cp .env.example .env.local
pnpm db:generate            # generate the initial migration
pnpm db:migrate             # apply it to local SQLite
pnpm dev
```

Open <http://localhost:3000> and sign in with the password from `.env.local`
(default: `changeme`).

The app uses a local SQLite file at `./local.db` by default. No Turso or
Postgres needed for dev.

## Deploying to Vercel + Turso (free tiers)

1. **Create a Turso DB**
   - Sign up at <https://app.turso.tech>.
   - Create a database. Copy the URL (`libsql://…`) and an auth token.

2. **Push this repo to GitHub** (private is fine).

3. **Connect to Vercel**
   - Sign up at <https://vercel.com>.
   - "Add New… → Project" → import the GitHub repo.
   - In project settings → Environment Variables, set:

     | Name                  | Value                                      |
     | --------------------- | ------------------------------------------ |
     | `DATABASE_URL`        | `libsql://your-db-name.turso.io`           |
     | `DATABASE_AUTH_TOKEN` | _(the Turso auth token)_                   |
     | `CMS_PASSWORD`        | _(your shared password)_                   |
     | `AUTH_SECRET`         | _(run `openssl rand -hex 32`)_             |

   - Trigger a deploy. The first build will fail because migrations haven't
     run yet on the remote DB — that's expected.

4. **Run migrations against the remote DB once**

   ```bash
   DATABASE_URL="libsql://your-db-name.turso.io" \
     DATABASE_AUTH_TOKEN="…" \
     pnpm db:migrate
   ```

5. **Redeploy**. Every subsequent push to `main` redeploys automatically.
   Push to a feature branch and Vercel creates a preview URL with the same
   password gate.

## Routes

| Route                   | Purpose                                       |
| ----------------------- | --------------------------------------------- |
| `/`                     | Redirects to `/admin`                         |
| `/login`                | Password entry                                |
| `/admin`                | Dashboard                                     |
| `/admin/docs`           | List of documents                             |
| `/admin/docs/new`       | New document                                  |
| `/admin/docs/[id]/edit` | Edit a document                               |
| `/admin/categories`     | Manage categories                             |
| `/preview/[slug]`       | Rendered preview using UoL design system CSS  |

## What's in this phase

This is **Phase 1** of the plan — skeleton, deployment-ready, basic CRUD,
preview route with UoL chrome. The content editor is still a plain HTML
textarea. Phase 2 replaces it with TipTap and the JADU-style toolbar.

## Tech stack

- **Next.js 15** (App Router) — admin and preview live in separate route
  groups (`(admin)` and `(preview)`) so Tailwind doesn't leak into the
  UoL-styled preview.
- **Drizzle ORM** + **libSQL** — same code drives local SQLite and Turso.
- **jose** — password-gate session cookie (HS256-signed JWT).
- **Tailwind v4** — admin UI styling only.
- **UoL design system CSS** — loaded from `jaducdn.leeds.ac.uk` on preview
  pages only.

## Scripts

- `pnpm dev` — start the dev server.
- `pnpm build` — production build.
- `pnpm start` — run the production build.
- `pnpm db:generate` — create a new SQL migration from `src/db/schema.ts`.
- `pnpm db:migrate` — apply pending migrations to the database in `DATABASE_URL`.
- `pnpm db:studio` — open Drizzle Studio (a local web UI for the DB).
