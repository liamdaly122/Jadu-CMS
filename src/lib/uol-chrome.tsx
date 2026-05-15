import type { ReactNode } from "react";
import { HEADER_HTML, FOOTER_HTML } from "./uol-chrome-html";

export function SiteHeader() {
  return <div dangerouslySetInnerHTML={{ __html: HEADER_HTML }} />;
}

export function SiteFooter() {
  return <div dangerouslySetInnerHTML={{ __html: FOOTER_HTML }} />;
}

type SectionNavItem = {
  title: string;
  slug: string;
  isCurrent: boolean;
};

export function SectionNav({
  sectionTitle,
  items,
}: {
  sectionTitle: string;
  items: SectionNavItem[];
}) {
  if (items.length === 0) return null;
  return (
    <nav className="uol-section-nav" aria-label="Section navigation">
      <h2 className="uol-section-nav__title">
        <span className="uol-section-nav__title__intro">In this section</span>
        <span className="uol-section-nav__title__text">{sectionTitle}</span>
      </h2>
      <ul className="uol-section-nav__list">
        {items.map((it) => (
          <li
            key={it.slug}
            className={`uol-section-nav__item${
              it.isCurrent ? " uol-section-nav__item--current" : ""
            }`}
          >
            <a
              className="uol-section-nav__link"
              href={`/preview/${it.slug}`}
              aria-current={it.isCurrent ? "page" : undefined}
            >
              <span className="uol-section-nav__item__label">{it.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Breadcrumb({
  category,
  title,
}: {
  category?: string;
  title: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className="uol-breadcrumb">
      <ol className="uol-breadcrumb__list">
        <li className="uol-breadcrumb__item">
          <a className="uol-breadcrumb__link" href="https://www.leeds.ac.uk">
            Home
          </a>
        </li>
        {category && (
          <li className="uol-breadcrumb__item">
            <span className="uol-breadcrumb__link">{category}</span>
          </li>
        )}
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

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-outer">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
