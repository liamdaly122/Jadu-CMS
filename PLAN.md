# Jadu-CMS Replacement — Plan

## Goal

A staging/authoring web app for JADU document pages with **pixel-accurate live
preview** using the existing UoL design system. Authors draft here, copy the
generated HTML, and paste it into JADU's CKEditor Source view.

Deployed as a real web app — code lives in GitHub, Vercel auto-deploys every
push, accessible from any device behind a password gate.

Eventually extends to a homepage designer.

## Hard constraints

- **Free**: hosting, database, image hosting, editor, dependencies. Everything.
- **Hosted**: GitHub repo → Vercel auto-deploy → password-gated public URL.
  Every push to `main` ships to production; every push to a feature branch
  gets its own Vercel preview URL automatically.
- **Export target**: HTML pasted into JADU's CKEditor Source view. Output
  HTML must use the exact UoL design system class names so it renders
  correctly on the live site without modification.
- **Feature parity** with JADU's CKEditor toolbar (see Editor section).
- **No image uploads**: paste an external image URL (typically from JADU's
  image library, since the asset already lives there for the live page) or
  use a placeholder. Side benefit: cuts hosting cost to zero and keeps image
  URLs portable.

## Stack

| Layer       | Choice                                          | Free tier? |
| ----------- | ----------------------------------------------- | ---------- |
| Source      | GitHub repo                                     | Yes        |
| Framework   | Next.js 15 (App Router)                         | Yes        |
| Hosting     | Vercel (Hobby plan)                             | Yes        |
| DB          | Turso (libSQL — SQLite-compatible)              | Yes (9 GB) |
| ORM         | Drizzle (`@libsql/client` driver)               | Yes        |
| Editor      | TipTap (MIT) with custom nodes per UoL plugin   | Yes        |
| Admin UI    | Tailwind + shadcn/ui                            | Yes        |
| Preview CSS | UoL DS stylesheet from `jaducdn.leeds.ac.uk`    | Yes        |
| Auth        | Password gate via middleware + signed cookie    | Yes        |
| Images      | External URLs only; placeholder fallback        | Yes        |

**Why Turso**: SQLite-compatible (so local dev uses a plain `file:./local.db`
and prod uses `libsql://…` — same code, one env var swap), generous free tier
(500 DBs, 9 GB storage, 1 B row reads/month — orders of magnitude more than
we need), works perfectly with Vercel's serverless model.

**Why Vercel**: built by Next.js team, free tier covers our use case
indefinitely, GitHub integration is one click, every branch gets a preview
URL — perfect for letting stakeholders see drafts.

## Auth — password gate

A single shared password (no user accounts).

- `CMS_PASSWORD` env var set in Vercel project settings.
- `middleware.ts` checks for a signed `cms_session` cookie on every
  `/admin/*` and `/preview/*` request. If missing or invalid, redirect to
  `/login`.
- `/login` accepts the password, verifies, sets the cookie (HTTP-only,
  Secure, SameSite=Lax, ~30-day expiry).
- Cookie value is a JWT or HMAC-signed token using `AUTH_SECRET` env var.

Total auth code: ~40 lines. No database tables, no email, no recovery flow
(if you forget the password, change the env var in Vercel).

## Deploy workflow

1. `git push origin main` → Vercel builds + deploys to production URL.
2. `git push origin feature/xyz` → Vercel builds + deploys to a unique
   preview URL like `jadu-cms-feature-xyz.vercel.app`. Same password gate,
   same Turso DB (or a separate "preview" branch DB if we want isolation
   later — Turso supports DB branching for free).
3. Env vars live in Vercel project settings: `TURSO_DATABASE_URL`,
   `TURSO_AUTH_TOKEN`, `CMS_PASSWORD`, `AUTH_SECRET`.
4. Local dev: `.env.local` overrides with `file:./local.db` and a dev
   password. Same `pnpm dev` workflow; no production data risk.

## Data model

```
Document
  id              text primary key
  slug            text unique
  title           text not null
  featuredImage   json   -- { url, alt } | null
  contentJson     json   -- TipTap doc (source of truth)
  contentHtml     text   -- rendered cache (also the export payload)
  status          text   -- 'draft' | 'published'
  categoryId      text   -- nullable
  relatedLinks    json   -- [{ label, url }]
  relatedContent  json   -- [{ title, url, description }]
  metaDescription text
  createdAt, updatedAt

Category
  id        text primary key
  name      text
  slug      text
  parentId  text   -- hierarchy for breadcrumb + section nav

Snippet                -- mirrors JADU's JaduSnippet
  id        text primary key
  name      text
  contentHtml text
```

No `User` table — single shared password is the entire auth model.

## Editor — feature parity with JADU

Every JADU/Leeds CKEditor plugin maps to a TipTap extension. Built-in TipTap
extensions cover most; custom **Node** or **Mark** extensions handle the
Leeds-specific ones. Each custom node renders to HTML with the exact UoL DS
class names so the output is paste-ready.

| JADU toolbar plugin       | Implementation                             | Output HTML (target) |
| ------------------------- | ------------------------------------------ | -------------------- |
| Bold, Italic              | TipTap built-in                            | `<strong>`, `<em>`   |
| Format (H2/H3/lead etc.)  | TipTap Heading + custom paragraph variants | `<h2>`, `<h3>`, `<p class="uol-rich-text__lead">` |
| Undo/Redo/Copy/Paste/Cut  | TipTap History + browser native            | n/a                  |
| Maximize                  | UI toggle (CSS fullscreen on editor pane)  | n/a                  |
| NumberedList/BulletedList | TipTap built-in                            | `<ol>`, `<ul>`       |
| JaduAbbreviation          | Custom Mark                                | `<abbr title="…">`   |
| Designsystemaccordion     | Custom Node with nested items              | `<div class="uol-accordion">…</div>` |
| LeedsBlockquote           | TipTap Blockquote, styled variant          | `<blockquote class="uol-pull-quote">` |
| Language                  | Custom Mark                                | `<span lang="…">`    |
| MenuButton                | Custom Node                                | UoL menu-button markup |
| leedstellink              | Custom Mark                                | `<a href="tel:…">`   |
| LeedsCalltoaction         | Custom Node                                | `<a class="uol-button">` |
| Leedsvideogrid            | Custom Node                                | UoL video-grid markup |
| Link/Unlink/Anchor        | TipTap Link + custom Anchor mark           | `<a>`, `<a id="…">`  |
| JaduImage / Leedsimage    | Custom Node (URL field, alt, caption)      | `<figure class="uol-…">` |
| HorizontalRule            | TipTap built-in                            | `<hr>`               |
| SpecialChar               | Custom popover with picker                 | unicode characters   |
| JaduTime / JaduDate       | Custom Nodes                               | `<time datetime="…">`|
| JaduSnippet               | Custom Node referencing a `Snippet` table  | inlined HTML         |
| Table                     | TipTap Table                               | `<table>`            |
| Spellchecker              | Browser-native (`spellcheck="true"`)       | n/a                  |
| JaduReadability           | Tiny readability calc in sidebar           | n/a                  |
| Source                    | Toggle to read-only HTML view              | n/a                  |
| Replace                   | TipTap find-and-replace extension          | n/a                  |
| JaduContentStatistics     | Word/char count in sidebar                 | n/a                  |

**Discovery step before building (Phase 0)**: pull
`https://jaducdn.leeds.ac.uk/uol-ds/1.0.20/css/style.css` and inspect what
class names exist for each component. Document the exact markup each
component renders with. This becomes the spec the custom nodes target.

## Page renderer

Mirror JADU's page HTML structure as React components. Based on
`pageexample.html`:

```
<PageShell>                       -- site-outer wrapper
  <GlobalMasthead />              -- logo + quicklinks + search (static config)
  <LocalNav />                    -- Home / Study / Research… (static config)
  <SectionNav category={…} />     -- "In this section" sibling pages
  <Breadcrumb category={…} />     -- derived from category hierarchy
  <PageHeading title={…} />
  <FeaturedImage … />             -- uses external URL or placeholder SVG
  <RichTextContent html={…} />    -- TipTap-generated HTML, sanitised
  <RelatedLinks items={…} />
  <RelatedContent items={…} />
  <SiteFooter />                  -- static
</PageShell>
```

Preview at `/preview/[slug]`. Pulls UoL DS stylesheet via
`<link rel="stylesheet" href="https://jaducdn.leeds.ac.uk/uol-ds/1.0.20/css/style.css">`.
Static chrome (masthead, local nav, footer) lives in
`src/lib/uol-chrome.tsx` — single source of truth.

## Editor UX

Two-pane at `/admin/docs/[id]/edit`:

- **Left**: form — title, featured image (URL field with paste-from-JADU
  hint), TipTap content area, related links list, related content list,
  category selector, status toggle.
- **Right**: live preview iframe pointing at `/preview/[slug]?draft=1`.
  Re-renders on save (and on a debounced timer for smoother feedback).

Action bar mirrors JADU's familiar buttons:
- **Save draft** / **Mark as published**
- **Copy HTML** — copies `contentHtml` to clipboard, ready to paste into
  JADU's CKEditor Source view
- **Open preview in new tab**
- **Share preview link** — copies the public preview URL (still
  password-gated, but stakeholders just need the password)

## Admin shell

| Route                   | Purpose                                       |
| ----------------------- | --------------------------------------------- |
| `/login`                | Password entry                                |
| `/admin`                | Dashboard — recent docs, quick links          |
| `/admin/docs`           | List view (title, categories, status)         |
| `/admin/docs/new`       | New doc                                       |
| `/admin/docs/[id]/edit` | Two-pane editor                               |
| `/admin/categories`     | Manage category hierarchy                     |
| `/admin/snippets`       | Reusable content snippets (matches JADU)      |
| `/preview/[slug]`       | Live preview (no admin chrome, UoL CSS only)  |

## Phases

**Phase 0 — Discovery (half a day)**
- Pull UoL DS CSS, document the class names for each component we need to
  emit (accordion, pull quote, CTA, video grid, lead paragraph, image
  variants…).
- Outcome: a `docs/uol-component-map.md` spec the editor nodes target.

**Phase 1 — Skeleton + deploy**
- Next.js + Tailwind + Drizzle + Turso scaffold.
- Push to GitHub, connect to Vercel, verify auto-deploy works.
- Password gate middleware + `/login` page — live before we add any data.
- `Document` CRUD with title + plain textarea content.
- `/preview/[slug]` renders with UoL CSS and static chrome.

**Phase 2 — Real editor (built-in features)**
- TipTap integration covering all built-in toolbar items: bold, italic,
  headings, lists, links, blockquote, table, hr, undo/redo.
- "Copy HTML" button.
- Two-pane editor + live preview iframe.

**Phase 3 — Custom UoL nodes**
- One PR per custom node: Accordion, Pull Quote, CTA, Tel Link, Video Grid,
  Leeds Image (with caption), Abbreviation, Language, Snippet, Time/Date,
  Anchor.
- Each emits HTML matching the UoL DS spec from Phase 0.
- Each PR gets a Vercel preview URL — eyeball the rendered component before
  merging.

**Phase 4 — Page chrome + supplements**
- All chrome components (masthead, local nav, section nav, breadcrumb, footer).
- Categories with hierarchy.
- Related links + related content fields.
- Source-view toggle, find/replace, readability score, word count.

**Phase 5 — Polish**
- Doc list filters (status, category) matching JADU's UI.
- Auto-save.
- Snippets library page.
- "Share preview link" button.

## Future: homepage designer

Block-based editor — drag rows of UoL DS components (hero, card grid, CTA
strip, accordion) into a page. Each block is a React component with its own
props schema; stored as `blocksJson` on a `Homepage` record. Reuses the same
preview renderer and chrome.

## Open questions

1. **Snippets** — JADU has a `JaduSnippet` plugin. Is this used in the pages
   you maintain, and if so, what does it produce? (Could be deferred if rare.)
2. **Categories vs. URL slugs** — JADU's URL pattern is
   `/{category-slug}/doc/{page-slug}`. Do we need to mimic that for the
   preview, or is `/preview/{slug}` enough since we're not actually serving?
3. **Multiple pages workflow** — do you typically work on one page at a time,
   or hop between several? (Affects whether we need draft management /
   tabs / multi-doc autosave.)
4. **Preview sharing** — should the password gate allow time-limited share
   links (so stakeholders don't need the master password), or is one shared
   password fine?
