"use client";

import type { NodeViewProps } from "@tiptap/react";
import { NodeWrapper } from "./node-wrapper";
import { openDialog } from "../editor-dialog";
import { pullQuoteDialog } from "./dialogs";

type Align = "left" | "right" | "center";

export function PullQuoteView({
  node,
  updateAttributes,
  deleteNode,
  editor,
  getPos,
}: NodeViewProps) {
  const quote = (node.attrs.quote ?? "") as string;
  const align = (node.attrs.align ?? "left") as Align;

  const onEdit = () =>
    openDialog(
      pullQuoteDialog(
        { quote, align },
        (values) =>
          updateAttributes({
            quote: values.quote,
            align: (values.align as Align) ?? "left",
          }),
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
        className={`uol-typography-pull-quote uol-typography-pull-quote--${align}`}
      >
        <p>{quote || <em>Empty quote</em>}</p>
      </div>
    </NodeWrapper>
  );
}
