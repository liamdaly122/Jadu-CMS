# UoL Component Map

Spec for every HTML output our TipTap editor must produce. Source of truth for
the renderer and for each custom Node/Mark extension.

## Sources used

- **Production stylesheet** (used by leeds.ac.uk):
  `https://jaducdn.leeds.ac.uk/uol-ds/1.0.20/css/style.css`
  Inventoried via `uol-library/uol-design-system` repo on GitHub
  (`assets-1.0.20/css/style.css`).
- **Component templates** (verbatim HTML structure):
  `uol-library/jekyll-theme-uol` repo, `_includes/components/*.html`.
- **Live page reference**:
  the `pageexample.html` upload (Thank you for registering your interest).
- **JADU CKEditor toolbar** (what features we need to match):
  the JADU editor HTML upload.

## Confidence legend

- **✓ confirmed** — verbatim template from official repo.
- **~ inferred** — class names from CSS inventory, structure deduced from
  BEM convention + live page evidence. Verify on first build.
- **? unverified** — class exists but structure is a guess; needs a live page
  example to confirm during Phase 2/3.

---

## Page chrome (static)

Wraps every preview page. Lives in `src/lib/uol-chrome.tsx` as a single
source of truth. Markup taken verbatim from the example page upload.

```html
<div class="site-outer">
  <div class="uol-header">
    <header class="uol-global-masthead-outer uol-global-masthead-outer--with-local-navigation">
      <div class="uol-global-masthead uol-content-container">
        <!-- logo, skip-link, search form, quicklinks -->
      </div>
    </header>
    <nav class="uol-header-local-navigation-wrapper uol-content-container">
      <ul class="uol-header-local-navigation">…</ul>
    </nav>
  </div>

  <nav class="uol-section-nav">…</nav>            <!-- "In this section" -->

  <div class="uol-content-container uol-main-container">
    <nav class="uol-breadcrumb">…</nav>
    <div class="uol-col-container uol-page-container">
      <div class="uol-side-nav-container"></div>
      <main id="main" tabindex="-1" class="uol-page">
        <div class="uol-page__head">
          <header class="page-heading">
            <h1 class="page-heading__title">{title}</h1>
          </header>
        </div>
        <div class="uol-page__content">
          <!-- featured image, rich-text content, related links, related content -->
        </div>
      </main>
    </div>
  </div>

  <footer class="uol-site-footer-outer">…</footer>
</div>
```

Static chrome elements (masthead, local nav, footer) are configuration
constants. The dynamic per-doc elements are listed below.

### Featured image  ✓ confirmed

Source: `jekyll-theme-uol/_includes/components/image.html`.

```html
<figure class="uol-featured-image">
    <img class="uol-featured-image__img" src="{url}" alt="{alt}">
    <figcaption class="uol-featured-image__caption">{caption}</figcaption>
</figure>
```

Optional `<figcaption>`. Aspect ratio guidance: 2:1, recommended 1100×550 px.

### Rich-text wrapper  ✓ confirmed

```html
<div class="uol-rich-text">
  <!-- editor content goes here -->
</div>
```

Modifier: `uol-rich-text--with-lead` — styles the first `<p>` as a lead
paragraph. Expose as an editor toggle ("First paragraph is lead text").

### Related links (sidebar CTAs)  ~ inferred (matches example page)

```html
<aside class="uol-section-nav-ctas" aria-label="Related links">
  <h3 class="uol-section-nav-ctas__title">Related links</h3>
  <div class="uol-section-nav-ctas__links">
    <a class="uol-button uol-section-nav-ctas__link" href="{url}">{label}</a>
    …
  </div>
</aside>
```

### Related content  ~ inferred (matches example page)

```html
<aside class="uol-content-switch-from-side-to-main uol-section-nav-related-content"
       aria-label="Related content">
  <h2 class="uol-section-nav-related-content__title">Related content</h2>
  <div class="uol-section-nav-related-content__list">
    <div class="uol-section-nav-related__item">
      <h3 class="uol-section-nav-related-content__item__title">
        <a class="uol-section-nav-related-content__item__title__link" href="{url}">{title}</a>
      </h3>
      <p class="uol-section-nav-related-content__item__text">{description}</p>
    </div>
    …
  </div>
</aside>
```

---

## Editor components (TipTap targets)

One row per JADU CKEditor toolbar item. Order matches the toolbar groups in
the JADU editor HTML.

### Bold  ✓

- **Output**: `<strong>…</strong>`
- **TipTap**: built-in `Bold` extension.

### Italic  ✓

- **Output**: `<em>…</em>`
- **TipTap**: built-in `Italic` extension.

### Format (paragraph styles)  ✓

- **Headings 2–6**: plain `<h2>`…`<h6>`. (No `<h1>` — that's the page title.)
- **Paragraph**: plain `<p>`.
- **Lead paragraph**: see "Rich-text wrapper" — set by toggling
  `uol-rich-text--with-lead` on the wrapper; the first `<p>` is styled.
- **TipTap**: built-in `Heading` + `Paragraph`.

### Numbered list  ✓

- **Output**: `<ol><li>…</li></ol>`. The `uol-rich-text` parent provides
  styling (no class needed on the `ol`).
- **TipTap**: built-in `OrderedList` + `ListItem`.

### Bulleted list  ✓

- **Output**: `<ul><li>…</li></ul>`.
- **TipTap**: built-in `BulletList` + `ListItem`.

### Block quote  ✓ confirmed

Source: `jekyll-theme-uol/_includes/components/quote.html`.

```html
<blockquote class="uol-typography-blockquote" cite="{citeurl}">
  <p>{content}</p>
  <footer>
    <cite><a href="{citeurl}">{cite}</a></cite>
  </footer>
</blockquote>
```

- **TipTap**: built-in `Blockquote`, extended to support optional `cite`
  attr and `<footer><cite>` child.

### Pull quote (JADU's `LeedsBlockquote`)  ✓ confirmed

```html
<div aria-hidden="true"
     class="uol-typography-pull-quote uol-typography-pull-quote--{align}">
  <p>{content}</p>
</div>
```

- `align` ∈ `left` (default) | `right` | `center` (~ inferred for centre).
- **TipTap**: custom Node `PullQuote` with `align` attribute.

### Accordion (JADU's `Designsystemaccordion`)  ✓ confirmed

Source: `jekyll-theme-uol/_includes/components/accordion.html`.

```html
<div class="uol-accordion uol-rich-text">
  <h2 class="uol-accordion__title">{title}</h2>
  <div class="uol-accordion__content">
    <div class="uol-accordion__content-inner">
      <div class="uol-rich-text">{nested rich content}</div>
    </div>
  </div>
</div>
```

- Multiple accordion items rendered as sibling `<div class="uol-accordion">`
  blocks (each one is independently expandable).
- **TipTap**: custom Node `Accordion` containing a title (`text`) and a
  body (`block+` content, so nested rich text works).
- ~ inferred: the `<h2>` may need a different heading level depending on
  page context (the docs site had an "Accordion: H4" variant). For now use
  `<h2>`; revisit if visually wrong.

### Call to action (JADU's `LeedsCalltoaction`)  ✓ confirmed

Source: `jekyll-theme-uol/_includes/components/inline-ctas.html`.

```html
<div class="uol-widget-container uol-widget-container__ctas">
  <div class="uol-widget uol-widget--ctas">
    <div class="uol-widget__content">
      <div class="uol-in-text-ctas-wrapper">
        <div class="uol-in-text-cta">
          <h2 class="uol-in-text-cta__heading">
            <a class="uol-in-text-cta__link" href="{url}">{title}</a>
          </h2>
          <p class="uol-in-text-cta__text">{text}</p>
        </div>
        <!-- repeat .uol-in-text-cta per CTA -->
      </div>
    </div>
  </div>
</div>
```

- **TipTap**: custom Node `CtaGroup` (the wrapper) containing 1..n `Cta`
  child nodes (each with `url`, `title`, `text`).

### Tel link (JADU's `leedstellink`)  ~ inferred

- **Output**: `<a href="tel:{number}">{label}</a>` — no special class
  observed; UoL CSS styles all `<a>` consistently inside `uol-rich-text`.
- **TipTap**: custom Mark (or extend `Link`) that produces `tel:` href.

### Link  ✓

- **Output**: `<a href="{url}" rel="noreferrer noopener" target="_blank">…</a>`
  (target/rel optional, toggled by user).
- **TipTap**: built-in `Link`.

### Anchor (in-page jump target)  ~ inferred

- **Output**: `<a id="{anchor}"></a>` placed inline, or `id` attr on a
  heading.
- **TipTap**: custom Mark `Anchor` adding `id` attribute.

### Image (JADU's `Leedsimage` / `JaduImage`)  ~ inferred

For inline body images (distinct from the page's featured image), the
expected pattern inside rich text is:

```html
<figure class="uol-rich-text__image">
  <img src="{url}" alt="{alt}">
  <figcaption>{caption}</figcaption>
</figure>
```

- ? unverified: exact class on inline `<figure>`. The CSS has
  `uol-rich-text figcaption` and `uol-featured-image__caption`, but the
  inline image wrapper class needs a live-page sample to confirm. Default
  to the figure/figcaption pattern; refine when we have an example.
- **TipTap**: custom Node `LeedsImage` with `url`, `alt`, `caption`,
  `align` attributes.

### Horizontal rule  ✓

- **Output**: `<hr>`.
- **TipTap**: built-in `HorizontalRule`.

### Special characters  ✓

- **Output**: literal unicode characters in text.
- **TipTap**: custom popover with a picker; on select, insert the character.

### Time / Date (JADU's `JaduTime`, `JaduDate`)  ~ inferred

- **Output**: `<time datetime="{iso}">{display}</time>`.
- **TipTap**: custom Node (block) or Mark (inline) with `datetime` attr.
- ? unverified: whether JADU adds any UoL class. Plain `<time>` looks
  correct based on the CSS not having a `uol-time-*` rule.

### Snippet (JADU's `JaduSnippet`)  ? unverified

- JADU concept (reusable HTML blocks). No UoL DS analogue.
- **Output**: inline the snippet's HTML at the insertion point.
- **TipTap**: custom Node referencing a `Snippet` record by id. Render
  resolves the snippet at preview/export time.
- Defer to Phase 5 unless we discover it's heavily used.

### Abbreviation (JADU's `JaduAbbreviation`)  ✓

- **Output**: `<abbr title="{long}">{short}</abbr>`.
- **TipTap**: custom Mark.

### Language (JADU's `Language`)  ✓

- **Output**: `<span lang="{lang}">{text}</span>`.
- **TipTap**: custom Mark with `lang` attr.

### Menu Button (JADU's `MenuButton`)  ? unverified

- Possibly a styled `<button>` or button group. No CSS rule identified yet
  beyond generic `uol-button`.
- Defer until we find a page that uses one. Most doc pages won't.

### Video grid (JADU's `Leedsvideogrid`)  ~ inferred

Based on `jekyll-theme-uol/_includes/components/gallery.html`, video items
sit inside a `uol-gallery-container` with item-count-aware classes:

```html
<section class="uol-gallery-container uol-gallery--count-{n}" aria-label="…">
  <!-- per item: image or video figure with placeholder + data-video attr -->
</section>
```

- ? unverified: full markup for the video-grid variant specifically. Needs
  a live page sample.
- **TipTap**: custom Node `VideoGrid` containing 1..n `VideoItem` children
  (each with `videoUrl`, `posterUrl`, `title`).

### Table  ✓ confirmed (variant 1) / ~ inferred (variant 2)

Two patterns exist:

1. **Index table** (sortable, with caption) — from
   `jekyll-theme-uol/_includes/components/table.html`:

   ```html
   <h2 class="uol-index-table-caption uol-index-table-caption__border">{caption}</h2>
   <table class="uol-index-table js-uolTableStackable">
     <thead><tr><th class="uol-index-table__th">…</th></tr></thead>
     <tbody><tr><td class="uol-index-table__td" data-value="…">…</td></tr></tbody>
   </table>
   ```

2. **Plain table inside rich text** — CSS rule `uol-rich-text table`
   styles bare `<table>` markup. For most editor inserts this is enough.

- **TipTap**: built-in `Table` for the plain variant. Treat the index
  table as a phase-5 enhancement if needed.

### Spellchecker  ✓

- Browser-native (`spellcheck="true"` on the editor).
- No HTML output.

### Source view  ✓

- UI feature: toggle the editor pane to a textarea showing the rendered
  HTML. Read-only at first; bidirectional later.
- No HTML output.

### Find / Replace  ✓

- TipTap `@tiptap-pro/extension-search-and-replace` is paid. Free
  alternative: community `tiptap-extension-search-and-replace` package, or
  hand-roll using the editor's ProseMirror state.
- No HTML output.

### Readability  ✓

- Sidebar widget. Flesch reading ease + grade. Pure JS, no extra HTML.

### Content statistics (word/char count)  ✓

- TipTap `CharacterCount` extension covers this for free.

---

## What's still uncertain

These are the spots where a quick eyeball of a real UoL live page during
Phase 2/3 will resolve the markup. Capture screenshots + view-source for
each:

1. A doc page with an **accordion** in body content — confirm heading
   level inside `uol-accordion__title`.
2. A doc page with an **inline image** (not the featured image) — confirm
   the wrapper class on the `<figure>`.
3. A doc page with a **video grid** — confirm full markup.
4. A doc page using `JaduSnippet` — see what HTML it emits.
5. A doc page using **MenuButton** — same.

Phase 2 task: gather these examples (curl can't reach the CDN from the
sandbox, but during local dev we can just browse and view-source).

## Rich-text wrapper rule

Every TipTap output blob is wrapped in `<div class="uol-rich-text">` (or
`uol-rich-text--with-lead` if the lead toggle is on) before being placed
in the preview. The **Copy HTML** export copies the inner HTML *without*
this wrapper, because JADU's CKEditor in Source view already lives inside
the rich-text container on the live page.

## Implementation order

1. **Phase 2 covers** all the ✓ confirmed built-in items + Bold/Italic/
   Headings/Lists/Link/HR/Blockquote/Pull Quote.
2. **Phase 3 covers** the custom nodes: Accordion, CTA group, Leeds Image,
   Tel Link, Abbreviation, Language, Anchor, Time/Date.
3. **Phase 4 covers** Video Grid + Snippet + Menu Button if needed.
