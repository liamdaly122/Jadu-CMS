"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { Anchor, Pencil, Trash2 } from "lucide-react";
import { openDialog } from "../editor-dialog";
import { anchorDialog } from "./dialogs";

export function AnchorView({
  node,
  updateAttributes,
  deleteNode,
}: NodeViewProps) {
  const onEdit = () =>
    openDialog(
      anchorDialog(
        { id: node.attrs.id },
        (values) => updateAttributes({ id: values.id }),
        "Save"
      )
    );

  return (
    <NodeViewWrapper as="span" className="uol-anchor-marker">
      <Anchor size={11} />
      <span className="uol-anchor-marker__id">#{node.attrs.id}</span>
      <button
        type="button"
        onClick={onEdit}
        title="Edit anchor"
        className="uol-anchor-marker__btn"
        contentEditable={false}
      >
        <Pencil size={10} />
      </button>
      <button
        type="button"
        onClick={deleteNode}
        title="Delete anchor"
        className="uol-anchor-marker__btn uol-anchor-marker__btn--danger"
        contentEditable={false}
      >
        <Trash2 size={10} />
      </button>
    </NodeViewWrapper>
  );
}
