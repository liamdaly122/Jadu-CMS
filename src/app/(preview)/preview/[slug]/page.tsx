import { notFound } from "next/navigation";
import { db, documents, categories } from "@/db";
import { and, asc, eq, ne } from "drizzle-orm";
import {
  Breadcrumb,
  FeaturedImage,
  PageHeading,
  PageShell,
  RelatedContent,
  RelatedLinks,
  RichTextContent,
  SectionNav,
} from "@/lib/uol-chrome";

export const dynamic = "force-dynamic";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [doc] = await db
    .select()
    .from(documents)
    .where(eq(documents.slug, slug))
    .limit(1);

  if (!doc) notFound();

  const [category] = doc.categoryId
    ? await db
        .select()
        .from(categories)
        .where(eq(categories.id, doc.categoryId))
        .limit(1)
    : [];

  // Walk up the parent chain so the breadcrumb shows the full hierarchy.
  const categoryChain: string[] = [];
  if (category) {
    let current: typeof category | undefined = category;
    const seen = new Set<string>();
    while (current && !seen.has(current.id)) {
      seen.add(current.id);
      categoryChain.unshift(current.name);
      if (!current.parentId) break;
      const [parent] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, current.parentId))
        .limit(1);
      current = parent;
    }
  }

  const siblings = doc.categoryId
    ? await db
        .select({
          id: documents.id,
          title: documents.title,
          slug: documents.slug,
        })
        .from(documents)
        .where(
          and(
            eq(documents.categoryId, doc.categoryId),
            ne(documents.id, doc.id)
          )
        )
        .orderBy(asc(documents.title))
    : [];

  const sectionItems = category
    ? [
        { title: doc.title, slug: doc.slug, isCurrent: true },
        ...siblings.map((s) => ({
          title: s.title,
          slug: s.slug,
          isCurrent: false,
        })),
      ]
    : [];

  return (
    <PageShell>
      {category && (
        <SectionNav sectionTitle={category.name} items={sectionItems} />
      )}
      <div className="uol-content-container uol-main-container">
        <Breadcrumb categoryChain={categoryChain} title={doc.title} />
        <div className="uol-col-container uol-page-container">
          <div className="uol-side-nav-container"></div>
          <main id="main" tabIndex={-1} className="uol-page">
            <PageHeading title={doc.title} />
            <div className="uol-page__content">
              <FeaturedImage
                url={doc.featuredImageUrl}
                alt={doc.featuredImageAlt}
              />
              <RichTextContent html={doc.contentHtml ?? ""} />
              <RelatedLinks items={doc.relatedLinks} />
              <RelatedContent items={doc.relatedContent} />
            </div>
          </main>
        </div>
      </div>
    </PageShell>
  );
}
