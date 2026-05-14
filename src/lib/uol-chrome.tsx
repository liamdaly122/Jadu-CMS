import type { ReactNode } from "react";

export function GlobalMasthead() {
  return (
    <header className="uol-global-masthead-outer uol-global-masthead-outer--with-local-navigation">
      <div className="uol-global-masthead uol-content-container">
        <div className="uol-global-masthead__inner">
          <a className="uol-skip-link" href="#main">
            Skip to main content
          </a>
          <a
            className="uol-global-masthead__home"
            href="https://www.leeds.ac.uk"
          >
            <span className="hide-accessible">
              University of Leeds homepage
            </span>
          </a>
        </div>
        <form
          className="uol-global-masthead__search-form"
          action="https://www.leeds.ac.uk/search"
        >
          <label
            className="uol-global-masthead__search-label"
            htmlFor="global-masthead__search-field"
          >
            Search leeds.ac.uk
          </label>
          <input
            className="uol-global-masthead__search-input"
            id="global-masthead__search-field"
            name="q"
            type="search"
            placeholder="Search leeds.ac.uk"
          />
          <button
            className="uol-global-masthead__search-submit"
            type="submit"
          >
            <span className="hide-accessible">Search all leeds.ac.uk</span>
          </button>
        </form>
      </div>
    </header>
  );
}

export function LocalNav() {
  const items = [
    { label: "Home", href: "https://www.leeds.ac.uk" },
    { label: "Study", href: "https://www.leeds.ac.uk/undergraduate" },
    {
      label: "Research and innovation",
      href: "https://www.leeds.ac.uk/research-and-innovation",
    },
    {
      label: "Business and partnerships",
      href: "https://www.leeds.ac.uk/business-partnerships",
    },
    {
      label: "Around campus",
      href: "https://www.leeds.ac.uk/around-campus",
    },
    {
      label: "Give to Leeds",
      href: "https://www.leeds.ac.uk/give-to-leeds",
    },
    { label: "About", href: "https://www.leeds.ac.uk/about" },
  ];

  return (
    <nav
      className="uol-header-local-navigation-wrapper uol-content-container"
      aria-label="Site navigation"
    >
      <ul className="uol-header-local-navigation">
        {items.map((it) => (
          <li
            key={it.href}
            className="uol-header-local-navigation__item"
            data-label={it.label}
          >
            <a className="uol-header-local-navigation__link" href={it.href}>
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Breadcrumb({ title }: { title: string }) {
  return (
    <nav aria-label="Breadcrumb" className="uol-breadcrumb">
      <ol className="uol-breadcrumb__list">
        <li className="uol-breadcrumb__item">
          <a className="uol-breadcrumb__link" href="//www.leeds.ac.uk">
            Home
          </a>
        </li>
        <li className="uol-breadcrumb__item">
          <span className="uol-breadcrumb__link" aria-current="page">
            {title}
          </span>
        </li>
      </ol>
    </nav>
  );
}

export function PageHeading({ title }: { title: string }) {
  return (
    <div className="uol-page__head">
      <header className="page-heading">
        <h1 className="page-heading__title">{title}</h1>
      </header>
    </div>
  );
}

export function FeaturedImage({
  url,
  alt,
}: {
  url: string | null;
  alt: string | null;
}) {
  if (!url) return null;
  return (
    <figure className="uol-featured-image">
      <img className="uol-featured-image__img" src={url} alt={alt ?? ""} />
    </figure>
  );
}

export function RichTextContent({ html }: { html: string }) {
  return (
    <div
      className="uol-rich-text uol-rich-text--with-lead"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function RelatedLinks({
  items,
}: {
  items: { label: string; url: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <aside className="uol-section-nav-ctas" aria-label="Related links">
      <h3 className="uol-section-nav-ctas__title">Related links</h3>
      <div className="uol-section-nav-ctas__links">
        {items.map((it) => (
          <a
            key={it.url}
            className="uol-button uol-section-nav-ctas__link"
            href={it.url}
          >
            {it.label}
          </a>
        ))}
      </div>
    </aside>
  );
}

export function RelatedContent({
  items,
}: {
  items: { title: string; url: string; description: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <aside
      className="uol-content-switch-from-side-to-main uol-section-nav-related-content"
      aria-label="Related content"
    >
      <h2 className="uol-section-nav-related-content__title">
        Related content
      </h2>
      <div className="uol-section-nav-related-content__list">
        {items.map((it) => (
          <div key={it.url} className="uol-section-nav-related__item">
            <h3 className="uol-section-nav-related-content__item__title">
              <a
                className="uol-section-nav-related-content__item__title__link"
                href={it.url}
              >
                {it.title}
              </a>
            </h3>
            {it.description && (
              <p className="uol-section-nav-related-content__item__text">
                {it.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

export function SiteFooter() {
  return (
    <footer className="uol-site-footer-outer">
      <div className="uol-site-footer uol-content-container">
        <div className="uol-site-footer__site-information-container">
          <nav
            className="footer-site-information"
            aria-label="Site information"
          >
            <ul className="footer-site-information__list">
              <li className="footer-site-information__item">
                © {new Date().getFullYear()} University of Leeds
              </li>
              <li className="footer-site-information__item">
                <a
                  href="https://www.leeds.ac.uk/privacy"
                  className="footer-site-information__link"
                >
                  Privacy
                </a>
              </li>
              <li className="footer-site-information__item">
                <a
                  href="https://www.leeds.ac.uk/about/doc/accessibility-statement"
                  className="footer-site-information__link"
                >
                  Accessibility
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-outer">
      <div className="uol-header">
        <GlobalMasthead />
        <LocalNav />
      </div>
      {children}
      <SiteFooter />
    </div>
  );
}
