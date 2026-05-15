"use client";

import { useTransition } from "react";
import { RotateCcw, Trash2 } from "lucide-react";

export function TrashRowActions({
  title,
  restore,
  purge,
}: {
  title: string;
  restore: () => Promise<void>;
  purge: () => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => restore())}
        title="Restore"
        className="inline-flex items-center gap-1 rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
      >
        <RotateCcw size={12} /> Restore
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (
            !confirm(
              `Permanently delete "${title}"? This cannot be undone.`
            )
          )
            return;
          startTransition(() => purge());
        }}
        title="Delete forever"
        className="inline-flex items-center gap-1 rounded border border-red-300 dark:border-red-900 text-red-700 dark:text-red-300 px-2 py-1 text-xs hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50"
      >
        <Trash2 size={12} /> Delete forever
      </button>
    </div>
  );
}
