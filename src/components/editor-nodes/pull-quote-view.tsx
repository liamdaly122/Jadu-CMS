"use client";

import type { NodeViewProps } from "@tiptap/react";
import { NodeWrapper } from "./node-wrapper";
import { openDialog } from "../editor-dialog";
import { pullQuoteDialog } from "./dialogs";

export function PullQuoteView({
  node,
  updateAttributes,
  deleteNode,
  editor,
  getPos,
}: NodeViewProps) {
  const onEdit = () =>
    openDialog(
      pullQuoteDialog(
        { quote: node.attrs.quote, author: node.attrs.author },
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
        type: "pullQuote",
        attrs: { ...node.attrs },
      })
      .run();
  };

  return (
    <NodeWrapper
      label="Pull quote"
      onEdit={onEdit}
      onDuplicate={onDuplicate}
      onDelete={deleteNode}
    >
      <div
        aria-hidden="true"
        className="uol-typography-pull-quote uol-typography-pull-quote--left"
      >
        <p>{node.attrs.quote || <em>Empty quote</em>}</p>
        {node.attrs.author && (
          <footer className="uol-pull-quote__footer">
            <cite>— {node.attrs.author}</cite>
          </footer>
        )}
      </div>
    </NodeWrapper>
  );
}
