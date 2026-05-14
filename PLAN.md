# Jadu-CMS Replacement — Plan

## Goal

A staging/authoring web app for JADU document pages with **pixel-accurate live
preview** using the existing UoL design system. Authors draft here, copy the
generated HTML, and paste it into JADU's CKEditor **Source view**.

Eventually extends to a homepage designer.

## Hard constraints

- **Free**: hosting, database, image hosting, editor, dependencies. Everything.
- **Local-first**: runs on `localhost` on the author's machine. No deployment,
  no auth needed for v1. Optional Vercel + password gate later if previews
  need sharing.
- **Export target**: HTML pasted into JADU's CKEditor Source view. Output
  HTML must use the exact UoL design system class names so it renders
  correctly on the live site without modification.
- **Feature parity** with JADU's CKEditor toolbar (see Editor section).
- **No image uploads**: paste an external image URL (typically from JADU's
  image library, since the asset already lives there for the live page) or
  use a placeholder. Side benefit: cuts hosting cost to zero and keeps image
  URLs portable.

## Stack

| Layer       | Choice                                          | Free? |
| ----------- | ----------------------------------------------- | ----- |
| Framework   | Next.js 15 (App Router)                         | Yes   |
| DB          | SQLite via `better-sqlite3` (file in repo dir)  | Yes   |
| ORM         | Drizzle                                         | Yes   |
| Editor      | TipTap (MIT) with custom nodes per UoL plugin   | Yes   |
| Admin UI    | Tailwind + shadcn/ui                            | Yes   |
| Preview CSS | UoL DS stylesheet from `jaducdn.leeds.ac.uk`    | Yes   |
| Auth        | None for v1 (local only)                        | n/a   |
| Hosting     | `pnpm dev` on author's machine                  | Yes   |
| Images      | External URLs only; placeholder fallback        | Yes   |

SQLite (single file) over Postgres because local-first means no DB server to
run. Trivially swappable for Postgres if we deploy later.

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
```

No `User` table for v1.

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

**Discovery step before building**: pull
`https://jaducdn.leeds.ac.uk/uol-ds/1.0.20/css/style.css` and inspect what
class names exist for each component (accordion, pull-quote, CTA, video grid,
etc.). Document the exact markup each renders with. This becomes the spec the
custom nodes target.

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

## Admin shell

| Route                   | Purpose                                       |
| ----------------------- | --------------------------------------------- |
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

**Phase 1 — Skeleton**
- Next.js + Tailwind + Drizzle + SQLite scaffold.
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

**Phase 4 — Page chrome + supplements**
- All chrome components (masthead, local nav, section nav, breadcrumb, footer).
- Categories with hierarchy.
- Related links + related content fields.
- Source-view toggle, find/replace, readability score, word count.

**Phase 5 — Polish**
- Doc list filters (status, category) matching JADU's UI.
- Auto-save.
- Snippets library page.

## Future: homepage designer

Block-based editor — drag rows of UoL DS components (hero, card grid, CTA
strip, accordion) into a page. Each block is a React component with its own
props schema; stored as `blocksJson` on a `Homepage` record. Reuses the same
preview renderer and chrome.

## Free-tier upgrade path (if we ever deploy)

If we decide to share previews with stakeholders later:
- **Hosting**: Vercel free tier (Next.js native).
- **DB**: swap SQLite for Neon Postgres free tier (Drizzle makes this a
  one-line driver change).
- **Auth**: middleware password gate using `CMS_PASSWORD` env var + a
  signed cookie. No user database needed.
- **Images**: stay with external URLs; if we ever need uploads, Cloudflare R2
  free tier (10 GB, no egress) is the cheapest option.

## Open questions

1. **Snippets** — JADU has a `JaduSnippet` plugin. Is this used in the pages
   you maintain, and if so, what does it produce? (Could be deferred if rare.)
2. **Categories vs. URL slugs** — JADU's URL pattern is
   `/{category-slug}/doc/{page-slug}`. Do we need to mimic that for the
   preview, or is `/preview/{slug}` enough since we're not actually serving?
3. **Multiple pages workflow** — do you typically work on one page at a time,
   or hop between several? (Affects whether we need draft management /
   tabs / multi-doc autosave.)
