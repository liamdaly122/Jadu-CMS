"use client";

import { useEditor, EditorContent, type Editor as TipTapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  Quote,
  Highlighter,
  Minus,
  Undo,
  Redo,
  Image as ImageIcon,
  Megaphone,
  Phone,
  ChevronsUpDown,
  Anchor as AnchorIcon,
  Calendar,
  Languages,
} from "lucide-react";
import { useCallback } from "react";

import { PullQuote } from "./editor-nodes/pull-quote";
import { UolBlockQuote } from "./editor-nodes/block-quote";
import { LeedsImage } from "./editor-nodes/leeds-image";
import { Cta } from "./editor-nodes/cta";
import { Abbreviation } from "./editor-nodes/abbreviation";
import { Accordion } from "./editor-nodes/accordion";
import { Language } from "./editor-nodes/language";
import { Anchor } from "./editor-nodes/anchor";
import { TimeElement } from "./editor-nodes/time-element";
import { EditorDialogHost, openDialog } from "./editor-dialog";
import {
  pullQuoteDialog,
  blockQuoteDialog,
  leedsImageDialog,
  ctaDialog,
  accordionDialog,
  linkDialog,
  telLinkDialog,
  abbreviationDialog,
  languageDialog,
  anchorDialog,
  timeDialog,
} from "./editor-nodes/dialogs";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export function Editor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4, 5, 6] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer" },
        protocols: ["http", "https", "tel", "mailto"],
      }),
      PullQuote,
      UolBlockQuote,
      LeedsImage,
      Cta,
      Abbreviation,
      Accordion,
      Language,
      Anchor,
      TimeElement,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "min-h-[400px] max-w-none p-4 focus:outline-none prose-editor",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return (
      <div className="rounded-md border border-slate-300 dark:border-slate-700">
        <div className="border-b border-slate-200 dark:border-slate-800 px-3 py-2 h-[42px]" />
        <div className="min-h-[400px] p-4 text-sm text-slate-400">
          Loading editor…
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950">
        <Toolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>
      <EditorDialogHost />
    </>
  );
}

function Toolbar({ editor }: { editor: TipTapEditor }) {
  const setLink = useCallback(() => {
    const prev = (editor.getAttributes("link").href ?? "") as string;
    openDialog(
      linkDialog({ href: prev }, (values) => {
        const href = values.href.trim();
        if (!href) {
          editor.chain().focus().extendMarkRange("link").unsetLink().run();
          return;
        }
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href })
          .run();
      }, prev ? "Save" : "Insert")
    );
  }, [editor]);

  const setTelLink = useCallback(() => {
    openDialog(
      telLinkDialog({}, (values) => {
        const cleaned = values.phone.replace(/[^0-9+]/g, "");
        if (!cleaned) return;
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: `tel:${cleaned}` })
          .run();
      })
    );
  }, [editor]);

  const setAbbr = useCallback(() => {
    const prev = (editor.getAttributes("abbreviation").title ?? "") as string;
    openDialog(
      abbreviationDialog({ title: prev }, (values) => {
        const title = values.title.trim();
        if (!title) {
          editor.chain().focus().unsetAbbreviation().run();
          return;
        }
        editor.chain().focus().setAbbreviation({ title }).run();
      })
    );
  }, [editor]);

  const setLanguage = useCallback(() => {
    const prev = (editor.getAttributes("language").lang ?? "") as string;
    openDialog(
      languageDialog({ lang: prev }, (values) => {
        const lang = values.lang.trim();
        if (!lang) {
          editor.chain().focus().unsetLanguage().run();
          return;
        }
        editor.chain().focus().setLanguage({ lang }).run();
      })
    );
  }, [editor]);

  const insertLeedsImage = useCallback(() => {
    openDialog(
      leedsImageDialog({}, (values) =>
        editor
          .chain()
          .focus()
          .insertLeedsImage({
            src: values.src,
            alt: values.alt,
            caption: values.caption,
          })
          .run()
      )
    );
  }, [editor]);

  const insertCta = useCallback(() => {
    openDialog(
      ctaDialog({}, (values) =>
        editor
          .chain()
          .focus()
          .insertCta({
            title: values.title,
            url: values.url,
            text: values.text,
          })
          .run()
      )
    );
  }, [editor]);

  const insertPullQuote = useCallback(() => {
    openDialog(
      pullQuoteDialog({}, (values) =>
        editor.chain().focus().insertPullQuote({ quote: values.quote }).run()
      )
    );
  }, [editor]);

  const insertBlockQuote = useCallback(() => {
    openDialog(
      blockQuoteDialog({}, (values) =>
        editor
          .chain()
          .focus()
          .insertUolBlockQuote({ quote: values.quote, author: values.author })
          .run()
      )
    );
  }, [editor]);

  const insertAccordion = useCallback(() => {
    openDialog(
      accordionDialog({}, (values) =>
        editor.chain().focus().insertAccordion({ title: values.title }).run()
      )
    );
  }, [editor]);

  const insertAnchor = useCallback(() => {
    openDialog(
      anchorDialog({}, (values) =>
        editor.chain().focus().insertAnchor({ id: values.id }).run()
      )
    );
  }, [editor]);

  const insertTime = useCallback(() => {
    openDialog(
      timeDialog({}, (values) =>
        editor
          .chain()
          .focus()
          .insertTime({ datetime: values.datetime, display: values.display })
          .run()
      )
    );
  }, [editor]);

  const setHeading = (v: string) => {
    if (v === "p") {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = parseInt(v.slice(1), 10) as 2 | 3 | 4 | 5 | 6;
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  const currentBlock = (() => {
    for (const l of [2, 3, 4, 5, 6]) {
      if (editor.isActive("heading", { level: l })) return `h${l}`;
    }
    return "p";
  })();

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 dark:border-slate-800 px-2 py-1.5">
      <ToolbarButton
        title="Bold (Ctrl+B)"
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Italic (Ctrl+I)"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
      >
        <Italic size={16} />
      </ToolbarButton>

      <ToolbarDivider />

      <select
        value={currentBlock}
        onChange={(e) => setHeading(e.target.value)}
        className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Format"
      >
        <option value="p">Paragraph</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
        <option value="h5">Heading 5</option>
        <option value="h6">Heading 6</option>
      </select>

      <ToolbarDivider />

      <ToolbarButton
        title="Bulleted list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Numbered list"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      >
        <ListOrdered size={16} />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Block quote (with attribution)"
        onClick={insertBlockQuote}
      >
        <Quote size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Pull quote (highlight key text)"
        onClick={insertPullQuote}
      >
        <Highlighter size={16} />
      </ToolbarButton>
      <ToolbarButton title="Accordion" onClick={insertAccordion}>
        <ChevronsUpDown size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus size={16} />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton title="Link" onClick={setLink} active={editor.isActive("link")}>
        <LinkIcon size={16} />
      </ToolbarButton>
      <ToolbarButton title="Phone link" onClick={setTelLink}>
        <Phone size={16} />
      </ToolbarButton>
      <ToolbarButton title="Anchor (jump target)" onClick={insertAnchor}>
        <AnchorIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Remove link"
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
      >
        <Unlink size={16} />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton title="Image" onClick={insertLeedsImage}>
        <ImageIcon size={16} />
      </ToolbarButton>
      <ToolbarButton title="Call to action" onClick={insertCta}>
        <Megaphone size={16} />
      </ToolbarButton>
      <ToolbarButton title="Date" onClick={insertTime}>
        <Calendar size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Abbreviation"
        onClick={setAbbr}
        active={editor.isActive("abbreviation")}
      >
        <span className="text-[11px] font-bold tracking-wider">ABBR</span>
      </ToolbarButton>
      <ToolbarButton
        title="Language tag"
        onClick={setLanguage}
        active={editor.isActive("language")}
      >
        <Languages size={16} />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Undo (Ctrl+Z)"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Redo (Ctrl+Shift+Z)"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo size={16} />
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed ${
        active
          ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          : ""
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-800" />;
}
