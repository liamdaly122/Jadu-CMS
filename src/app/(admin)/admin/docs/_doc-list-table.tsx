"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Trash2, CheckCircle2, FileEdit, X } from "lucide-react";

type Row = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  updatedAt: string;
  categoryName: string | null;
};

type Props = {
  rows: Row[];
  activeFilter: boolean;
  deleteAction: (id: string, redirectAfter?: boolean) => Promise<void>;
  bulkSoftDeleteAction: (ids: string[]) => Promise<void>;
  bulkSetStatusAction: (
    ids: string[],
    status: "draft" | "published"
  ) => Promise<void>;
};

export function DocListTable({
  rows,
  activeFilter,
  deleteAction,
  bulkSoftDeleteAction,
  bulkSetStatusAction,
}: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  const allChecked = rows.length > 0 && selected.size === rows.length;
  const someChecked = selected.size > 0 && selected.size < rows.length;

  const toggleAll = () => {
    if (allChecked) {
      setSelected(new Set());
    } else {
      setSelected(new Set(rows.map((r) => r.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const ids = () => Array.from(selected);

  const runBulkDelete = () => {
    const titles = rows
      .filter((r) => selected.has(r.id))
      .map((r) => `• ${r.title}`)
      .join("\n");
    if (
      !confirm(
        `Move ${selected.size} document${selected.size === 1 ? "" : "s"} to Trash?\n\n${titles}\n\nYou can restore them from /admin/trash.`
      )
    ) {
      return;
    }
    startTransition(async () => {
      await bulkSoftDeleteAction(ids());
      setSelected(new Set());
    });
  };

  const runBulkSetStatus = (status: "draft" | "published") => {
    startTransition(async () => {
      await bulkSetStatusAction(ids(), status);
      setSelected(new Set());
    });
  };

  return (
    <div className="space-y-3">
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-md border border-blue-300 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900 px-3 py-2 text-sm">
          <span className="font-medium">
            {selected.size} selected
          </span>
          <button
            type="button"
            disabled={pending}
            onClick={() => runBulkSetStatus("published")}
            className="inline-flex items-center gap-1 rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-xs hover:bg-white dark:hover:bg-slate-900 disabled:opacity-50"
          >
            <CheckCircle2 size={12} /> Publish
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => runBulkSetStatus("draft")}
            className="inline-flex items-center gap-1 rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-xs hover:bg-white dark:hover:bg-slate-900 disabled:opacity-50"
          >
            <FileEdit size={12} /> Mark as draft
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={runBulkDelete}
            className="inline-flex items-center gap-1 rounded border border-red-300 dark:border-red-900 text-red-700 dark:text-red-300 px-2 py-1 text-xs hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50"
          >
            <Trash2 size={12} /> Move to Trash
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="ml-auto inline-flex items-center gap-1 text-xs text-slate-600 hover:underline"
          >
            <X size={12} /> Clear selection
          </button>
        </div>
      )}

      <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900 text-left">
            <tr>
              <th className="px-3 py-2 w-10">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={(el) => {
                    if (el) el.indeterminate = someChecked;
                  }}
                  onChange={toggleAll}
                  aria-label="Select all"
                  className="h-4 w-4 rounded border-slate-300 dark:border-slate-700"
                />
              </th>
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
                  colSpan={6}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  {activeFilter
                    ? "No documents match the filters."
                    : "No documents yet."}
                </td>
              </tr>
            )}
            {rows.map((d) => (
              <tr key={d.id}>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selected.has(d.id)}
                    onChange={() => toggleOne(d.id)}
                    aria-label={`Select ${d.title}`}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-700"
                  />
                </td>
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
                    <RowDelete
                      title={d.title}
                      onConfirm={() => deleteAction(d.id, false)}
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

function RowDelete({
  title,
  onConfirm,
}: {
  title: string;
  onConfirm: () => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      title={`Move "${title}" to Trash`}
      aria-label={`Move ${title} to Trash`}
      disabled={pending}
      onClick={() => {
        if (
          !confirm(
            `Move "${title}" to Trash? You can restore it from /admin/trash.`
          )
        ) {
          return;
        }
        startTransition(async () => {
          await onConfirm();
        });
      }}
      className="rounded p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50"
    >
      <Trash2 size={14} />
    </button>
  );
}
