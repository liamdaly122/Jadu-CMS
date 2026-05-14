# Jadu-CMS Replacement — Plan

## Goal

A staging/authoring web app for JADU document pages. Authors draft content with
**pixel-accurate live preview** using the existing UoL design system, then copy
or export the finished content into JADU. Eventually extends to a homepage
designer.

V1 scope: document pages only. Single user.

## Why not just use JADU?

- Editor is slow and dated; no live preview of the rendered page.
- Disconnected staging — you only see how it really looks after publishing.
- Authoring workflow is fragmented across tabs.

## Stack

| Layer       | Choice                                                |
| ----------- | ----------------------------------------------------- |
| Framework   | Next.js 15 (App Router)                               |
| DB          | Postgres (SQLite locally is fine to start)            |
| ORM         | Drizzle (lighter than Prisma; first-class SQL)        |
| Editor      | TipTap (ProseMirror-based, matches JADU's feature set)|
| Admin UI    | Tailwind + shadcn/ui                                  |
| Preview CSS | UoL DS stylesheet imported directly from JADU CDN     |
| Auth        | Single-password middleware gate                       |
| Hosting     | Vercel + Neon (free tiers) or local Docker            |

Keeping admin styling (Tailwind) and preview styling (UoL DS) isolated by
route — admin lives at `/admin/*`, preview at `/preview/*`. No CSS bleed.

## Data model

```
Document
  id              uuid
  slug            text unique
  title           text
  featuredImage   { url, alt }?
  contentJson     jsonb         -- TipTap doc
  contentHtml     text          -- rendered cache for preview
  status          enum('draft' | 'published')
  categoryId      uuid?
  relatedLinks    jsonb         -- [{ label, url }]
  relatedContent  jsonb         -- [{ title, url, description }]
  metaDescription text?
  createdAt, updatedAt

Category
  id        uuid
  name      text
  slug      text
  parentId  uuid?               -- hierarchy for breadcrumb + section nav

Image
  id        uuid
  url       text
  alt       text?
  width, height int
```

## Page renderer

Mirror the JADU page HTML structure as React components, each a slot the editor
fills. Based on the attached `pageexample.html`:

```
<PageShell>                       -- site-outer wrapper
  <GlobalMasthead />              -- logo + quicklinks + search (static config)
  <LocalNav />                    -- Home / Study / Research… (static config)
  <SectionNav category={…} />     -- "In this section" sibling pages
  <Breadcrumb category={…} />     -- derived from category hierarchy
  <PageHeading title={…} />
  <FeaturedImage … />
  <RichTextContent html={…} />    -- TipTap output, rendered safely
  <RelatedLinks items={…} />
  <RelatedContent items={…} />
  <SiteFooter />                  -- static
</PageShell>
```

Preview route `/preview/[slug]` renders exactly what leeds.ac.uk would show.
Pull UoL stylesheet via `<link rel="stylesheet" href="https://jaducdn.leeds.ac.uk/uol-ds/1.0.20/css/style.css">`
in the preview layout. Static chrome (masthead, local nav, footer) lives in a
config file — keeps a single source of truth and easy to update if UoL changes.

## Editor

Two-pane layout at `/admin/docs/[id]/edit`:

- **Left**: form — title, featured image (with media library picker),
  TipTap content area, related links list, related content list, category
  selector, status toggle.
- **Right**: live preview iframe pointing at `/preview/[slug]?draft=1`.
  Reload on save (or push updates via a postMessage channel for snappier UX).

TipTap extensions to match the JADU toolbar:
bold, italic, headings (H2/H3), paragraphs, links, blockquotes,
ordered/unordered lists, images (from media library), tables, source view.

Auto-save every ~2s of inactivity. Manual "Save draft" and "Publish" buttons.

## Admin shell

| Route                    | Purpose                                       |
| ------------------------ | --------------------------------------------- |
| `/admin`                 | Dashboard — recent docs, quick links          |
| `/admin/docs`            | List view (title, categories, visible status) |
| `/admin/docs/new`        | New doc                                       |
| `/admin/docs/[id]/edit`  | Two-pane editor                               |
| `/admin/categories`      | Manage category hierarchy                     |
| `/admin/media`           | Image library                                 |
| `/preview/[slug]`        | Live preview (no admin chrome)                |

## Phases

**Phase 1 — Skeleton**
- Next.js + Tailwind + Drizzle + Postgres scaffold
- `Document` CRUD with title + plain textarea content
- `/preview/[slug]` renders with UoL CSS and static chrome

**Phase 2 — Real editor**
- TipTap integration with the matching toolbar
- Media library + image upload (local disk for dev, S3/R2 for prod)
- Two-pane editor with live preview iframe
- Auto-save

**Phase 3 — Full page template**
- All chrome components (masthead, local nav, section nav, breadcrumb, footer)
- Categories with hierarchy
- Section nav auto-derived from category siblings
- Related links + related content fields wired up

**Phase 4 — Polish**
- Password gate
- Doc list filters (status, category) matching JADU's UI patterns
- Export to JADU-pasteable HTML (or a shareable preview URL)

## Future: homepage designer

Block-based editor — drag rows of UoL DS components (hero, card grid, CTA
strip, accordion) into a page. Each block is a React component with its own
props schema; stored as `blocksJson` on a `Homepage` record. Reuses the same
preview renderer and chrome.

## Open questions

1. **Export target** — does the final content need to be raw HTML pasted into
   JADU's source view, or is a shareable preview URL enough for stakeholders to
   review before someone manually replicates it in JADU?
2. **Image hosting** — host our own (S3/R2), embed JADU CDN URLs, or both?
3. **Sharing previews** — does the password gate need to allow link-sharing
   for stakeholders (signed URLs), or strictly single-user?
