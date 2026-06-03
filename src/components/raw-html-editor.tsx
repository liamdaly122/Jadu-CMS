"use client";

import { useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export function RawHtmlEditor({ value, onChange }: Props) {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullscreen) setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  const characters = value.length;

  const wrapperClasses = fullscreen
    ? "fixed inset-0 z-40 flex flex-col rounded-none border-none bg-white dark:bg-slate-950"
    : "rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950";

  return (
    <div className={wrapperClasses}>
      <div className="flex items-center justify-between gap-1 border-b border-slate-200 dark:border-slate-800 px-2 py-1.5">
        <span className="px-2 text-xs font-medium uppercase tracking-wider text-slate-500">
          Raw HTML
        </span>
        <button
          type="button"
          onClick={() => setFullscreen((v) => !v)}
          title={fullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}
          className="rounded p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
      <div className={fullscreen ? "flex-1 overflow-auto" : ""}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste or type HTML here. It is saved exactly as written — nothing is stripped or reformatted."
          spellCheck={false}
          className={`w-full p-4 text-sm font-mono focus:outline-none bg-white dark:bg-slate-950 ${
            fullscreen ? "h-full min-h-0" : "min-h-[400px]"
          }`}
        />
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-500">
        {characters} character{characters === 1 ? "" : "s"} · saved verbatim
      </div>
    </div>
  );
}
