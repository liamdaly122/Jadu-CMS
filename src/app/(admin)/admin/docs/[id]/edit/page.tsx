import Link from "next/link";
import { notFound } from "next/navigation";
import { db, documents, categories } from "@/db";
import { eq } from "drizzle-orm";
import { EditPane } from "@/components/edit-pane";
import { updateDoc, deleteDoc } from "../../actions";
import { DeleteButton } from "./_delete-button";

export default async function EditDocPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [docResult, cats] = await Promise.all([
    db.select().from(documents).where(eq(documents.id, id)).limit(1),
    db.select().from(categories).orderBy(categories.name),
  ]);
  const [doc] = docResult;

  if (!doc) notFound();

  const updateBound = updateDoc.bind(null, id);
  const deleteBound = deleteDoc.bind(null, id);

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="min-w-0">
          <Link
            href="/admin/docs"
            className="text-sm text-slate-500 hover:underline"
          >
            ← Back to documents
          </Link>
          <h1 className="text-lg font-semibold mt-0.5 truncate">
            {doc.title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <DeleteButton action={deleteBound} />
        </div>
      </header>

      <EditPane doc={doc} cats={cats} action={updateBound} />
    </div>
  );
}
