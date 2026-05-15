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

  // Fetch all categories + siblings in parallel. There are few categories so
  // a single SELECT is cheaper than walking the parent chain one row at a time.
  const [allCategories, siblings] = await Promise.all([
    db.select().from(categories),
    doc.categoryId
      ? db
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
      : Promise.resolve([] as { id: string; title: string; slug: string }[]),
  ]);

  const categoriesById = new Map(allCategories.map((c) => [c.id, c]));
  const category = doc.categoryId ? categoriesById.get(doc.categoryId) : undefined;

  const categoryChain: string[] = [];
  if (category) {
    const seen = new Set<string>();
    let current: typeof category | undefined = category;
    while (current && !seen.has(current.id)) {
      seen.add(current.id);
      categoryChain.unshift(current.name);
      current = current.parentId ? categoriesById.get(current.parentId) : undefined;
    }
  }

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
              <RichTextContent
                html={doc.contentHtml ?? ""}
                withLead={doc.withLead}
              />
              <RelatedLinks items={doc.relatedLinks} />
              <RelatedContent items={doc.relatedContent} />
            </div>
          </main>
        </div>
      </div>
    </PageShell>
  );
}
