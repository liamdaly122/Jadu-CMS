"use client";

import type { NodeViewProps } from "@tiptap/react";
import { NodeWrapper } from "./node-wrapper";
import { openDialog } from "../editor-dialog";
import { ctaDialog } from "./dialogs";

export function CtaView({
  node,
  updateAttributes,
  deleteNode,
  editor,
  getPos,
}: NodeViewProps) {
  const { title, url, text } = node.attrs as {
    title: string;
    url: string;
    text: string;
  };

  const onEdit = () =>
    openDialog(
      ctaDialog({ title, url, text }, (values) =>
        updateAttributes({
          title: values.title,
          url: values.url,
          text: values.text,
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
        type: "cta",
        attrs: { ...node.attrs },
      })
      .run();
  };

  return (
    <NodeWrapper
      label="Call to action"
      onEdit={onEdit}
      onDuplicate={onDuplicate}
      onDelete={deleteNode}
    >
      <div className="uol-widget-container uol-widget-container__ctas">
        <div className="uol-widget uol-widget--ctas">
          <div className="uol-widget__content">
            <div className="uol-in-text-ctas-wrapper">
              <div className="uol-in-text-cta">
                <h2 className="uol-in-text-cta__heading">
                  <a className="uol-in-text-cta__link" href={url}>
                    {title || <em>Untitled CTA</em>}
                  </a>
                </h2>
                <p className="uol-in-text-cta__text">{text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NodeWrapper>
  );
}
