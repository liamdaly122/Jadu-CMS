import Link from "next/link";
import { db, documents } from "@/db";
import { desc } from "drizzle-orm";

export default async function AdminDashboard() {
  const recent = await db
    .select()
    .from(documents)
    .orderBy(desc(documents.updatedAt))
    .limit(5);

  return (
    <div className="p-8 max-w-4xl">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link
          href="/admin/docs/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New document
        </Link>
      </header>

      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500 mb-3">
          Recent documents
        </h2>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            No documents yet.{" "}
            <Link
              href="/admin/docs/new"
              className="text-blue-600 hover:underline"
            >
              Create your first one
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800 rounded-md border border-slate-200 dark:border-slate-800">
            {recent.map((d) => (
              <li key={d.id} className="px-4 py-3 flex items-center gap-4">
                <Link
                  href={`/admin/docs/${d.id}/edit`}
                  className="flex-1 font-medium hover:underline"
                >
                  {d.title}
                </Link>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    d.status === "published"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {d.status}
                </span>
                <Link
                  href={`/preview/${d.slug}`}
                  target="_blank"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Preview
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
