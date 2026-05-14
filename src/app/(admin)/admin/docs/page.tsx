import Link from "next/link";
import { db, documents, categories } from "@/db";
import { desc, eq } from "drizzle-orm";

export default async function DocsList() {
  const rows = await db
    .select({
      id: documents.id,
      title: documents.title,
      slug: documents.slug,
      status: documents.status,
      updatedAt: documents.updatedAt,
      categoryName: categories.name,
    })
    .from(documents)
    .leftJoin(categories, eq(documents.categoryId, categories.id))
    .orderBy(desc(documents.updatedAt));

  return (
    <div className="p-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Document Pages</h1>
        <Link
          href="/admin/docs/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New document
        </Link>
      </header>

      <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Title</th>
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Updated</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No documents yet.
                </td>
              </tr>
            )}
            {rows.map((d) => (
              <tr key={d.id}>
                <td className="px-4 py-2">
                  <Link
                    href={`/admin/docs/${d.id}/edit`}
                    className="font-medium hover:underline"
                  >
                    {d.title}
                  </Link>
                </td>
                <td className="px-4 py-2 text-slate-600 dark:text-slate-400">
                  {d.categoryName ?? "—"}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      d.status === "published"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-600 dark:text-slate-400">
                  {new Date(d.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/preview/${d.slug}`}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    Preview
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
