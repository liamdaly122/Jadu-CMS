import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { AnchorView } from "./anchor-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    anchor: {
      insertAnchor: (attrs: { id: string }) => ReturnType;
    };
  }
}

export const Anchor = Node.create({
  name: "anchor",
  inline: true,
  group: "inline",
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      id: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "a[id]",
        getAttrs: (el) => {
          const node = el as HTMLElement;
          // Only treat empty anchor tags as our anchor nodes
          if (node.textContent && node.textContent.trim() !== "") return false;
          return { id: node.getAttribute("id") ?? "" };
        },
      },
    ];
  },

  renderHTML({ node }) {
    return ["a", { id: node.attrs.id }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AnchorView);
  },

  addCommands() {
    return {
      insertAnchor:
        (attrs) =>
        ({ commands }) => {
          const id = attrs.id
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, "-")
            .replace(/^-+|-+$/g, "");
          return commands.insertContent({ type: this.name, attrs: { id } });
        },
    };
  },
});
