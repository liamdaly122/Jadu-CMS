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
  Minus,
  Undo,
  Redo,
} from "lucide-react";
import { useCallback } from "react";

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
        HTMLAttributes: {
          rel: "noopener noreferrer",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[400px] max-w-none p-4 focus:outline-none prose-editor",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return (
      <div className="rounded-md border border-slate-300 dark:border-slate-700">
        <div className="border-b border-slate-200 dark:border-slate-800 px-3 py-2 h-[42px]" />
        <div className="min-h-[400px] p-4 text-sm text-slate-400">Loading editor…</div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: TipTapEditor }) {
  const setLink = useCallback(() => {
    const prev = editor.getAttributes("link").href ?? "";
    const url = window.prompt("URL (leave empty to remove)", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
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
        title="Blockquote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
      >
        <Quote size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus size={16} />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Add or edit link"
        onClick={setLink}
        active={editor.isActive("link")}
      >
        <LinkIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Remove link"
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
      >
        <Unlink size={16} />
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
        active ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100" : ""
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-800" />;
}
