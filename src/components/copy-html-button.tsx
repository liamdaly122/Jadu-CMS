"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyHtmlButton({ html }: { html: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = html;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
      title="Copy the content HTML to paste into JADU's Source view"
    >
      {copied ? (
        <>
          <Check size={16} className="text-green-600" /> Copied
        </>
      ) : (
        <>
          <Copy size={16} /> Copy HTML
        </>
      )}
    </button>
  );
}
