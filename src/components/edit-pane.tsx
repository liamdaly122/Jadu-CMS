"use client";

import { useEffect, useState } from "react";
import {
  ExternalLink,
  RotateCw,
  Maximize2,
  Minimize2,
  Link2,
  Check,
} from "lucide-react";
import { DocForm } from "./doc-form";
import type { Document, Category } from "@/db";
import { getShareToken } from "@/app/(admin)/admin/docs/actions";

type Props = {
  doc: Document;
  cats: Category[];
  action: (formData: FormData) => Promise<void>;
};

export function EditPane({ doc, cats, action }: Props) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentSlug, setCurrentSlug] = useState(doc.slug);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const wrappedAction = async (formData: FormData) => {
    const submittedSlug = (formData.get("slug") as string)?.trim();
    if (submittedSlug) setCurrentSlug(submittedSlug);
    await action(formData);
    setRefreshKey((k) => k + 1);
  };

  const previewUrl = `/preview/${currentSlug}`;

  const copyShareLink = async () => {
    try {
      const token = await getShareToken(currentSlug);
      const url = `${window.location.origin}/preview/${currentSlug}?share=${token}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && previewFullscreen) setPreviewFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewFullscreen]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 h-[calc(100vh-4rem)] gap-0">
      <div className="overflow-auto p-6 border-r border-slate-200 dark:border-slate-800">
        <DocForm
          doc={doc}
          cats={cats}
          action={wrappedAction}
          submitLabel="Save"
          autoSave
        />
      </div>
      <div
        className={
          previewFullscreen
            ? "fixed inset-0 z-40 flex flex-col bg-slate-50 dark:bg-slate-900"
            : "hidden xl:flex flex-col bg-slate-50 dark:bg-slate-900"
        }
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-2 bg-white dark:bg-slate-950">
          <div className="text-sm font-medium">Live preview</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRefreshKey((k) => k + 1)}
              title="Refresh preview"
              className="inline-flex items-center gap-1 rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RotateCw size={12} /> Refresh
            </button>
            <button
              type="button"
              onClick={copyShareLink}
              title="Copy a 30-day share link that bypasses the password gate"
              className="inline-flex items-center gap-1 rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-green-600" /> Copied
                </>
              ) : (
                <>
                  <Link2 size={12} /> Share link
                </>
              )}
            </button>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ExternalLink size={12} /> Open in new tab
            </a>
            <button
              type="button"
              onClick={() => setPreviewFullscreen((v) => !v)}
              title={previewFullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}
              className="inline-flex items-center gap-1 rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {previewFullscreen ? (
                <Minimize2 size={12} />
              ) : (
                <Maximize2 size={12} />
              )}
            </button>
          </div>
        </div>
        <iframe
          key={refreshKey}
          src={previewUrl}
          className="flex-1 w-full bg-white"
          title="Live preview"
        />
      </div>
    </div>
  );
}
