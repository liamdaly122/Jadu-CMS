"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "url" | "date" | "select";
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: { label: string; value: string }[];
};

export type DialogConfig = {
  title: string;
  fields: FieldDef[];
  initial?: Record<string, string>;
  submitLabel?: string;
  onSubmit: (values: Record<string, string>) => void;
};

let opener: ((c: DialogConfig) => void) | null = null;

export function openDialog(config: DialogConfig) {
  opener?.(config);
}

export function EditorDialogHost() {
  const [config, setConfig] = useState<DialogConfig | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    opener = setConfig;
    return () => {
      opener = null;
    };
  }, []);

  if (!config || !mounted) return null;

  const handleClose = () => setConfig(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const fd = new FormData(e.currentTarget);
    const values: Record<string, string> = {};
    for (const f of config.fields) {
      values[f.name] = (fd.get(f.name) as string) ?? "";
    }
    config.onSubmit(values);
    handleClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={handleClose}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-white shadow-2xl dark:bg-slate-900"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">{config.title}</h2>
          {config.fields.map((f) => (
            <Field
              key={f.name}
              field={f}
              initial={config.initial?.[f.name] ?? ""}
            />
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              {config.submitLabel ?? "Insert"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

function Field({ field, initial }: { field: FieldDef; initial: string }) {
  const id = `dialog-field-${field.name}`;
  const common =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {field.label}
        {field.required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      {field.type === "textarea" ? (
        <textarea
          id={id}
          name={field.name}
          required={field.required}
          placeholder={field.placeholder}
          rows={4}
          defaultValue={initial}
          className={common}
          autoFocus
        />
      ) : field.type === "select" ? (
        <select
          id={id}
          name={field.name}
          required={field.required}
          defaultValue={initial}
          className={common}
          autoFocus
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={field.name}
          type={field.type}
          required={field.required}
          placeholder={field.placeholder}
          defaultValue={initial}
          className={common}
          autoFocus
        />
      )}
      {field.help && (
        <p className="mt-1 text-xs text-slate-500">{field.help}</p>
      )}
    </div>
  );
}
