"use client";

import { NodeViewWrapper } from "@tiptap/react";
import { Pencil, Copy, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  label?: string;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete: () => void;
  children: ReactNode;
};

export function NodeWrapper({
  label,
  onEdit,
  onDuplicate,
  onDelete,
  children,
}: Props) {
  return (
    <NodeViewWrapper className="uol-node-wrapper" data-label={label}>
      <div className="uol-node-wrapper__inner">
        <div className="uol-node-wrapper__actions" contentEditable={false}>
          {label && <span className="uol-node-wrapper__label">{label}</span>}
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              title="Edit"
              className="uol-node-wrapper__btn"
            >
              <Pencil size={13} />
            </button>
          )}
          {onDuplicate && (
            <button
              type="button"
              onClick={onDuplicate}
              title="Duplicate"
              className="uol-node-wrapper__btn"
            >
              <Copy size={13} />
            </button>
          )}
          <button
            type="button"
            onClick={onDelete}
            title="Delete"
            className="uol-node-wrapper__btn uol-node-wrapper__btn--danger"
          >
            <Trash2 size={13} />
          </button>
        </div>
        {children}
      </div>
    </NodeViewWrapper>
  );
}
