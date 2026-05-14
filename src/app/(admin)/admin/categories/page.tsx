import { db, categories } from "@/db";
import { createCategory, deleteCategory } from "./actions";

export default async function CategoriesPage() {
  const rows = await db.select().from(categories).orderBy(categories.name);

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Categories</h1>

      <form action={createCategory} className="flex gap-2 mb-6">
        <input
          name="name"
          required
          placeholder="Category name"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      {rows.length === 0 ? (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          No categories yet.
        </p>
      ) : (
        <ul className="divide-y divide-slate-200 dark:divide-slate-800 rounded-md border border-slate-200 dark:border-slate-800">
          {rows.map((c) => {
            const del = deleteCategory.bind(null, c.id);
            return (
              <li key={c.id} className="px-4 py-3 flex items-center gap-3">
                <span className="flex-1 font-medium">{c.name}</span>
                <code className="text-xs text-slate-500">{c.slug}</code>
                <form action={del}>
                  <button
                    type="submit"
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
