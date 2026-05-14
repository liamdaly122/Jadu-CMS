import { db, categories, type Document } from "@/db";

type Props = {
  action: (formData: FormData) => void;
  doc?: Document;
  submitLabel?: string;
};

export async function DocForm({ action, doc, submitLabel = "Save" }: Props) {
  const cats = await db.select().from(categories).orderBy(categories.name);

  return (
    <form action={action} className="space-y-5 max-w-3xl">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title <span className="text-red-600">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={doc?.title ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium mb-1">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          defaultValue={doc?.slug ?? ""}
          placeholder="auto-generated from title"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
        />
        <p className="text-xs text-slate-500 mt-1">
          Used for the preview URL: <code>/preview/{`{slug}`}</code>
        </p>
      </div>

      <div>
        <label htmlFor="featuredImageUrl" className="block text-sm font-medium mb-1">
          Featured image URL
        </label>
        <input
          id="featuredImageUrl"
          name="featuredImageUrl"
          type="url"
          defaultValue={doc?.featuredImageUrl ?? ""}
          placeholder="https://www.leeds.ac.uk/images/…"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
        />
        <p className="text-xs text-slate-500 mt-1">
          Paste a URL from JADU's image library (or any URL). Leave blank for a
          placeholder.
        </p>
      </div>

      <div>
        <label htmlFor="featuredImageAlt" className="block text-sm font-medium mb-1">
          Featured image alt text
        </label>
        <input
          id="featuredImageAlt"
          name="featuredImageAlt"
          type="text"
          defaultValue={doc?.featuredImageAlt ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
        />
      </div>

      <div>
        <label htmlFor="contentHtml" className="block text-sm font-medium mb-1">
          Content (HTML)
        </label>
        <textarea
          id="contentHtml"
          name="contentHtml"
          rows={14}
          defaultValue={doc?.contentHtml ?? ""}
          placeholder="<p>Your content here. Phase 2 will replace this with the rich editor.</p>"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
        />
        <p className="text-xs text-slate-500 mt-1">
          Plain HTML for now. Phase 2 swaps this for TipTap with the JADU
          toolbar.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium mb-1">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={doc?.categoryId ?? ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">— None —</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={doc?.status ?? "draft"}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <details className="rounded-md border border-slate-200 dark:border-slate-800">
        <summary className="cursor-pointer px-4 py-2 text-sm font-medium">
          Metadata (description, keywords)
        </summary>
        <div className="p-4 space-y-4 border-t border-slate-200 dark:border-slate-800">
          <div>
            <label htmlFor="metaDescription" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="metaDescription"
              name="metaDescription"
              rows={2}
              defaultValue={doc?.metaDescription ?? ""}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
          <div>
            <label htmlFor="metaKeywords" className="block text-sm font-medium mb-1">
              Keywords
            </label>
            <input
              id="metaKeywords"
              name="metaKeywords"
              type="text"
              defaultValue={doc?.metaKeywords ?? ""}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
        </div>
      </details>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
