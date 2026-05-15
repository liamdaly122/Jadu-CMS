"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { Pencil, Trash2 } from "lucide-react";
import { openDialog } from "../editor-dialog";
import { timeDialog } from "./dialogs";

function formatDisplay(datetime: string, display: string): string {
  if (display) return display;
  if (!datetime) return "(no date)";
  const d = new Date(datetime);
  if (isNaN(d.getTime())) return datetime;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function TimeView({
  node,
  updateAttributes,
  deleteNode,
}: NodeViewProps) {
  const { datetime, display } = node.attrs as {
    datetime: string;
    display: string;
  };

  const onEdit = () =>
    openDialog(
      timeDialog({ datetime, display }, (values) =>
        updateAttributes({ datetime: values.datetime, display: values.display }),
        "Save"
      )
    );

  return (
    <NodeViewWrapper as="span" className="uol-time-element">
      <time dateTime={datetime}>{formatDisplay(datetime, display)}</time>
      <button
        type="button"
        onClick={onEdit}
        title="Edit date"
        className="uol-time-element__btn"
        contentEditable={false}
      >
        <Pencil size={10} />
      </button>
      <button
        type="button"
        onClick={deleteNode}
        title="Delete date"
        className="uol-time-element__btn uol-time-element__btn--danger"
        contentEditable={false}
      >
        <Trash2 size={10} />
      </button>
    </NodeViewWrapper>
  );
}
