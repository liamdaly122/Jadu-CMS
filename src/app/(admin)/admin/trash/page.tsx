import Link from "next/link";
import type { Metadata } from "next";
import { db, documents, categories } from "@/db";
import { desc, eq, isNotNull } from "drizzle-orm";
import { restoreDoc, permanentlyDeleteDoc } from "../docs/actions";
import { TrashRowActions } from "./_trash-row-actions";

export const metadata: Metadata = { title: "Trash | Jadu-CMS" };

export default async function TrashPage() {
  const rows = await db
    .select({
      id: documents.id,
      title: documents.title,
      slug: documents.slug,
      status: documents.status,
      deletedAt: documents.deletedAt,
      categoryName: categories.name,
    })
    .from(documents)
    .leftJoin(categories, eq(documents.categoryId, categories.id))
    .where(isNotNull(documents.deletedAt))
    .orderBy(desc(documents.deletedAt));

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/admin/docs"
            className="text-sm text-slate-500 hover:underline"
          >
            ← Back to documents
          </Link>
          <h1 className="text-2xl font-semibold mt-1">Trash</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Documents you've moved to Trash. Restore them to bring them back, or
            delete permanently to remove them for good.
          </p>
        </div>
      </header>

      <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Title</th>
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium">Deleted</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Trash is empty.
                </td>
              </tr>
            )}
            {rows.map((d) => (
              <tr key={d.id}>
                <td className="px-4 py-2 font-medium">{d.title}</td>
                <td className="px-4 py-2 text-slate-600 dark:text-slate-400">
                  {d.categoryName ?? "—"}
                </td>
                <td className="px-4 py-2 text-slate-600 dark:text-slate-400">
                  {d.deletedAt
                    ? new Date(d.deletedAt).toLocaleString()
                    : "—"}
                </td>
                <td className="px-4 py-2 text-right">
                  <TrashRowActions
                    title={d.title}
                    restore={restoreDoc.bind(null, d.id)}
                    purge={permanentlyDeleteDoc.bind(null, d.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
