import Link from "next/link";
import { notFound } from "next/navigation";
import { db, documents } from "@/db";
import { eq } from "drizzle-orm";
import { DocForm } from "../../_form";
import { updateDoc, deleteDoc } from "../../actions";
import { DeleteButton } from "./_delete-button";

export default async function EditDocPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [doc] = await db
    .select()
    .from(documents)
    .where(eq(documents.id, id))
    .limit(1);

  if (!doc) notFound();

  const updateBound = updateDoc.bind(null, id);
  const deleteBound = deleteDoc.bind(null, id);

  return (
    <div className="p-8">
      <header className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/admin/docs"
            className="text-sm text-slate-500 hover:underline"
          >
            ← Back to documents
          </Link>
          <h1 className="text-2xl font-semibold mt-1">{doc.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/preview/${doc.slug}`}
            target="_blank"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Open preview
          </Link>
          <DeleteButton action={deleteBound} />
        </div>
      </header>

      <DocForm action={updateBound} doc={doc} submitLabel="Save" />
    </div>
  );
}
