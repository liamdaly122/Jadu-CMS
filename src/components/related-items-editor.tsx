"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";

type LinkItem = { label: string; url: string };
type ContentItem = { title: string; url: string; description: string };

function move<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const copy = items.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

function ItemControls({
  index,
  total,
  onMove,
  onDelete,
}: {
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-1 items-center pt-7">
      <button
        type="button"
        onClick={() => onMove(index, index - 1)}
        disabled={index === 0}
        title="Move up"
        className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
      >
        <GripVertical size={14} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        title="Remove"
        className="rounded p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
      >
        <Trash2 size={14} />
      </button>
      <span className="text-[10px] text-slate-400">
        {index + 1}/{total}
      </span>
    </div>
  );
}

export function RelatedLinksEditor({
  items,
  onChange,
}: {
  items: LinkItem[];
  onChange: (items: LinkItem[]) => void;
}) {
  const update = (i: number, patch: Partial<LinkItem>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, { label: "", url: "" }]);

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-slate-500">
          No related links yet. These appear as a row of buttons under the page
          content on the preview.
        </p>
      )}
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium mb-0.5 text-slate-600 dark:text-slate-400">
                Button label
              </label>
              <input
                type="text"
                value={it.label}
                onChange={(e) => update(i, { label: e.target.value })}
                placeholder="Course search"
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-0.5 text-slate-600 dark:text-slate-400">
                URL
              </label>
              <input
                type="url"
                value={it.url}
                onChange={(e) => update(i, { url: e.target.value })}
                placeholder="https://courses.leeds.ac.uk/"
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
          </div>
          <ItemControls
            index={i}
            total={items.length}
            onMove={(from, to) => onChange(move(items, from, to))}
            onDelete={() => remove(i)}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        <Plus size={14} /> Add related link
      </button>
    </div>
  );
}

export function RelatedContentEditor({
  items,
  onChange,
}: {
  items: ContentItem[];
  onChange: (items: ContentItem[]) => void;
}) {
  const update = (i: number, patch: Partial<ContentItem>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () =>
    onChange([...items, { title: "", url: "", description: "" }]);

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-slate-500">
          No related content items. These appear as a list of titled cards
          below the page content on the preview.
        </p>
      )}
      {items.map((it, i) => (
        <div
          key={i}
          className="flex gap-2 rounded-md border border-slate-200 dark:border-slate-800 p-3"
        >
          <div className="flex-1 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-0.5 text-slate-600 dark:text-slate-400">
                  Title
                </label>
                <input
                  type="text"
                  value={it.title}
                  onChange={(e) => update(i, { title: e.target.value })}
                  placeholder="Undergraduate webinar"
                  className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-0.5 text-slate-600 dark:text-slate-400">
                  URL
                </label>
                <input
                  type="url"
                  value={it.url}
                  onChange={(e) => update(i, { url: e.target.value })}
                  placeholder="https://youtu.be/…"
                  className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-0.5 text-slate-600 dark:text-slate-400">
                Description
              </label>
              <input
                type="text"
                value={it.description}
                onChange={(e) => update(i, { description: e.target.value })}
                placeholder="Short summary line"
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
          </div>
          <ItemControls
            index={i}
            total={items.length}
            onMove={(from, to) => onChange(move(items, from, to))}
            onDelete={() => remove(i)}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        <Plus size={14} /> Add related content
      </button>
    </div>
  );
}
