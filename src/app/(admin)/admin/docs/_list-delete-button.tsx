"use client";

import { Trash2 } from "lucide-react";

export function ListDeleteButton({
  action,
  title,
}: {
  action: () => void;
  title: string;
}) {
  return (
    <form action={action} className="inline">
      <button
        type="submit"
        title={`Delete "${title}"`}
        aria-label={`Delete ${title}`}
        onClick={(e) => {
          if (!confirm(`Delete "${title}"? This can't be undone.`)) {
            e.preventDefault();
          }
        }}
        className="rounded p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
      >
        <Trash2 size={14} />
      </button>
    </form>
  );
}
