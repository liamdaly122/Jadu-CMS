import Link from "next/link";
import type { Metadata } from "next";
import { db, documents, categories } from "@/db";
import { and, desc, eq, isNull, like } from "drizzle-orm";
import { bulkSetStatus, bulkSoftDelete, deleteDoc } from "./actions";
import { DocListTable } from "./_doc-list-table";

export const metadata: Metadata = { title: "Documents | Jadu-CMS" };

type SearchParams = Promise<{
  status?: string;
  category?: string;
  q?: string;
}>;

export default async function DocsList({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status = "", category = "", q = "" } = await searchParams;

  const conditions: ReturnType<typeof eq>[] = [isNull(documents.deletedAt)];
  if (status === "draft" || status === "published") {
    conditions.push(eq(documents.status, status));
  }
  if (category) {
    conditions.push(eq(documents.categoryId, category));
  }
  if (q.trim()) {
    conditions.push(like(documents.title, `%${q.trim()}%`));
  }
  const where = and(...conditions);

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

  const activeFilter = !!(status || category || q);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Document Pages</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/trash"
            className="text-sm text-slate-600 hover:underline dark:text-slate-400"
          >
            Trash
          </Link>
          <Link
            href="/admin/docs/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            New document
          </Link>
        </div>
      </header>

      <form
        action="/admin/docs"
        method="GET"
        className="flex flex-wrap items-end gap-3 mb-4"
      >
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="filter-q"
            className="block text-xs font-medium mb-0.5 text-slate-600 dark:text-slate-400"
          >
            Search title
          </label>
          <input
            id="filter-q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Type a few characters…"
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </div>
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
            href="/admin/docs"
            className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:underline"
          >
            Clear
          </Link>
        )}
      </form>

      <DocListTable
        rows={rows.map((r) => ({
          ...r,
          updatedAt: r.updatedAt.toISOString(),
        }))}
        activeFilter={activeFilter}
        deleteAction={deleteDoc}
        bulkSoftDeleteAction={bulkSoftDelete}
        bulkSetStatusAction={bulkSetStatus}
      />
    </div>
  );
}
