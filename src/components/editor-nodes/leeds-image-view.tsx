"use client";

import type { NodeViewProps } from "@tiptap/react";
import { ImageIcon } from "lucide-react";
import { NodeWrapper } from "./node-wrapper";
import { openDialog } from "../editor-dialog";
import { leedsImageDialog } from "./dialogs";

export function LeedsImageView({
  node,
  updateAttributes,
  deleteNode,
  editor,
  getPos,
}: NodeViewProps) {
  const { src, alt, caption } = node.attrs as {
    src: string;
    alt: string;
    caption: string;
  };

  const onEdit = () =>
    openDialog(
      leedsImageDialog({ src, alt, caption }, (values) =>
        updateAttributes({
          src: values.src,
          alt: values.alt,
          caption: values.caption,
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
        type: "leedsImage",
        attrs: { ...node.attrs },
      })
      .run();
  };

  return (
    <NodeWrapper
      label="Image"
      onEdit={onEdit}
      onDuplicate={onDuplicate}
      onDelete={deleteNode}
    >
      <figure className="uol-rich-text__figure">
        {src ? (
          <img src={src} alt={alt} />
        ) : (
          <div className="uol-image-placeholder">
            <ImageIcon size={32} strokeWidth={1.5} />
            <div>
              <div className="uol-image-placeholder__title">
                Image placeholder
              </div>
              <div className="uol-image-placeholder__hint">
                {alt
                  ? `Alt: ${alt}`
                  : "Replace with a real image in JADU after pasting."}
              </div>
            </div>
          </div>
        )}
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    </NodeWrapper>
  );
}
