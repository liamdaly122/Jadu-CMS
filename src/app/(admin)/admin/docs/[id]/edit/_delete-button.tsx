"use client";

export function DeleteButton({ action }: { action: () => void }) {
  return (
    <form action={action}>
      <button
        type="submit"
        className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
        onClick={(e) => {
          if (!confirm("Delete this document?")) e.preventDefault();
        }}
      >
        Delete
      </button>
    </form>
  );
}
