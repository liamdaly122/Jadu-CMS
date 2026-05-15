"use client";

import { NodeViewContent, type NodeViewProps } from "@tiptap/react";
import { NodeWrapper } from "./node-wrapper";
import { openDialog } from "../editor-dialog";
import { accordionDialog } from "./dialogs";

export function AccordionView({
  node,
  updateAttributes,
  deleteNode,
  editor,
  getPos,
}: NodeViewProps) {
  const onEdit = () =>
    openDialog(
      accordionDialog(
        { title: node.attrs.title },
        (values) => updateAttributes({ title: values.title }),
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
        type: "accordion",
        attrs: { ...node.attrs },
        content: [{ type: "paragraph" }],
      })
      .run();
  };

  return (
    <NodeWrapper
      label="Accordion"
      onEdit={onEdit}
      onDuplicate={onDuplicate}
      onDelete={deleteNode}
    >
      <div className="uol-accordion uol-rich-text">
        <h2 className="uol-accordion__title" contentEditable={false}>
          {node.attrs.title || <em>Untitled accordion</em>}
        </h2>
        <div className="uol-accordion__content">
          <div className="uol-accordion__content-inner">
            <NodeViewContent className="uol-rich-text" />
          </div>
        </div>
      </div>
    </NodeWrapper>
  );
}
