import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pullQuote: {
      setPullQuote: (attrs?: { align?: "left" | "right" }) => ReturnType;
    };
  }
}

export const PullQuote = Node.create({
  name: "pullQuote",
  group: "block",
  content: "inline*",
  defining: true,

  addAttributes() {
    return {
      align: {
        default: "left",
        parseHTML: (el) =>
          el.classList.contains("uol-typography-pull-quote--right")
            ? "right"
            : "left",
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div.uol-typography-pull-quote" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const align = node.attrs.align === "right" ? "right" : "left";
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "aria-hidden": "true",
        class: `uol-typography-pull-quote uol-typography-pull-quote--${align}`,
      }),
      ["p", 0],
    ];
  },

  addCommands() {
    return {
      setPullQuote:
        (attrs) =>
        ({ commands }) =>
          commands.setNode(this.name, attrs ?? {}),
    };
  },
});
