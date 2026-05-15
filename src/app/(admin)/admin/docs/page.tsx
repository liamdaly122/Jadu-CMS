import Link from "next/link";
import { db, documents, categories } from "@/db";
import { and, desc, eq } from "drizzle-orm";
import { deleteDoc } from "./actions";
import { ListDeleteButton } from "./_list-delete-button";

type SearchParams = Promise<{ status?: string; category?: string }>;

export default async function DocsList({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status = "", category = "" } = await searchParams;

  const conditions = [] as ReturnType<typeof eq>[];
  if (status === "draft" || status === "published") {
    conditions.push(eq(documents.status, status));
  }
  if (category) {
    conditions.push(eq(documents.categoryId, category));
  }
  const where = conditions.length === 0 ? undefined : and(...conditions);

  const [cats, rows] = await Promise.all([
    db.select().from(categories).orderBy(categories.name),
    db
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
      .where(where)
      .orderBy(desc(documents.updatedAt)),
  ]);

  const activeFilter = status || category;
  const clearHref = "/admin/docs";

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Document Pages</h1>
        <Link
          href="/admin/docs/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New document
        </Link>
      </header>

      <form
        action="/admin/docs"
        method="GET"
        className="flex items-end gap-3 mb-4"
      >
        <div>
          <label
            htmlFor="filter-status"
            className="block text-xs font-medium mb-0.5 text-slate-600 dark:text-slate-400"
          >
            Status
          </label>
          <select
            id="filter-status"
            name="status"
            defaultValue={status}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="filter-category"
            className="block text-xs font-medium mb-0.5 text-slate-600 dark:text-slate-400"
          >
            Category
          </label>
          <select
            id="filter-category"
            name="category"
            defaultValue={category}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">All</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Apply
        </button>
        {activeFilter && (
          <Link
            href={clearHref}
            className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:underline"
          >
            Clear filters
          </Link>
        )}
      </form>

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
                  {activeFilter ? "No documents match the filters." : "No documents yet."}
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
                  <div className="inline-flex items-center gap-3">
                    <Link
                      href={`/preview/${d.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Preview
                    </Link>
                    <ListDeleteButton
                      action={deleteDoc.bind(null, d.id, false)}
                      title={d.title}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
