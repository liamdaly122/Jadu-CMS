import { notFound } from "next/navigation";
import { db, documents } from "@/db";
import { eq } from "drizzle-orm";
import {
  Breadcrumb,
  FeaturedImage,
  PageHeading,
  PageShell,
  RelatedContent,
  RelatedLinks,
  RichTextContent,
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

  return (
    <PageShell>
      <div className="uol-content-container uol-main-container">
        <Breadcrumb title={doc.title} />
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
