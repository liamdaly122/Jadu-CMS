"use client";

import type { NodeViewProps } from "@tiptap/react";
import { NodeWrapper } from "./node-wrapper";
import { openDialog } from "../editor-dialog";
import { blockQuoteDialog } from "./dialogs";

export function BlockQuoteView({
  node,
  updateAttributes,
  deleteNode,
  editor,
  getPos,
}: NodeViewProps) {
  const { quote, author } = node.attrs as { quote: string; author: string };

  const onEdit = () =>
    openDialog(
      blockQuoteDialog(
        { quote, author },
        (values) =>
          updateAttributes({ quote: values.quote, author: values.author }),
        "Save"
      )
    );

  const onDuplicate = () => {
    const pos = typeof getPos === "function" ? getPos() : null;
    if (pos === null) return;
    editor
      .chain()
      .focus()
      .insertContentAt(pos + node.nodeSize, {
        type: "uolBlockQuote",
        attrs: { ...node.attrs },
      })
      .run();
  };

  return (
    <NodeWrapper
      label="Block quote"
      onEdit={onEdit}
      onDuplicate={onDuplicate}
      onDelete={deleteNode}
    >
      <blockquote className="uol-typography-blockquote">
        <p>{quote || <em>Empty quote</em>}</p>
        {author && (
          <footer>
            <cite>— {author}</cite>
          </footer>
        )}
      </blockquote>
    </NodeWrapper>
  );
}
