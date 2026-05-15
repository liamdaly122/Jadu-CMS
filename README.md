# Jadu-CMS

Staging editor for JADU document pages with a pixel-accurate live preview
using the University of Leeds design system. Author here, copy the rendered
HTML, paste into JADU's CKEditor Source view.

See `PLAN.md` and `docs/uol-component-map.md` for the full design.

## Deploy as a web app (no terminal needed)

The whole setup happens in your browser — no Node, no pnpm, nothing installed
on your laptop. Open Chrome and:

### 1. Create a free Turso database

1. Go to <https://app.turso.tech> and sign up (GitHub login is fastest).
2. Click **Create Database** → give it any name → pick the closest region.
3. On the database page, copy:
   - **Database URL** (looks like `libsql://yourname-yourorg.turso.io`)
   - **Auth Token** — click "Create Token", copy the value.

### 2. Make an `AUTH_SECRET`

We need a 32-byte random string for signing the login cookie. Easiest way:
in Chrome, press <kbd>F12</kbd> to open DevTools, click the **Console** tab,
paste this and press Enter:

```js
crypto.getRandomValues(new Uint8Array(32)).reduce((a,b)=>a+b.toString(16).padStart(2,'0'),'')
```

Copy the long hex string it prints.

### 3. Deploy to Vercel

1. Go to <https://vercel.com/signup> and sign in with GitHub.
2. Click **Add New… → Project**, find this repo, click **Import**.
3. Under **Environment Variables**, add these four:

   | Name                  | Value                                                |
   | --------------------- | ---------------------------------------------------- |
   | `DATABASE_URL`        | the Turso URL from step 1                            |
   | `DATABASE_AUTH_TOKEN` | the Turso auth token from step 1                     |
   | `CMS_PASSWORD`        | any password you'll remember (used to sign in)       |
   | `AUTH_SECRET`         | the hex string from step 2                           |

4. Click **Deploy**. Wait ~1 minute.

That's it. Vercel runs the database migrations automatically on every deploy,
so the schema is always up to date.

### 4. Use it

Open the Vercel URL it gives you (something like
`https://jadu-cms-yourname.vercel.app`). Enter your `CMS_PASSWORD`. You're in.

Every later code change you push to GitHub auto-deploys. Pushing to a feature
branch gets you a separate preview URL with the same password gate — handy
for showing drafts to colleagues without affecting your main workspace.

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

## Where this is in the plan

This is **Phase 1** — skeleton, deployable, basic CRUD, preview route with
UoL chrome. The content editor is still a plain HTML textarea. Phase 2
replaces it with TipTap and the JADU-style toolbar (bold/italic/headings/
lists/links/blockquote/hr) plus a **Copy HTML** button to paste into JADU's
CKEditor Source view.

## Tech stack

- **Next.js 15** (App Router) — admin and preview live in separate route
  groups (`(admin)` and `(preview)`) so Tailwind doesn't leak into the
  UoL-styled preview.
- **Drizzle ORM** + **libSQL** — same code drives local SQLite and Turso.
- **jose** — password-gate session cookie (HS256-signed JWT).
- **Tailwind v4** — admin UI styling only.
- **UoL design system CSS** — loaded from `jaducdn.leeds.ac.uk` on preview
  pages only.

## Running locally (optional)

You don't need this for normal use — the Vercel deploy is the whole product.
Only do this if you want to develop new features.

Requires Node 22+ and pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm db:generate     # generate the initial migration
pnpm db:migrate      # apply it to local SQLite
pnpm dev
```

Open <http://localhost:3000> and sign in with the password from `.env.local`
(default: `changeme`). The app uses a local SQLite file at `./local.db`.

## Scripts

- `pnpm dev` — start the dev server.
- `pnpm build` — production build (Next.js only).
- `pnpm vercel-build` — what Vercel runs: migrate then build.
- `pnpm start` — run the production build.
- `pnpm db:generate` — create a new SQL migration from `src/db/schema.ts`.
- `pnpm db:migrate` — apply pending migrations to `DATABASE_URL`.
- `pnpm db:studio` — open Drizzle Studio (a local web UI for the DB).
