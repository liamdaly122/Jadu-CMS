import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { BlockQuoteView } from "./block-quote-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    uolBlockQuote: {
      insertUolBlockQuote: (attrs: {
        quote: string;
        author?: string;
      }) => ReturnType;
    };
  }
}

export const UolBlockQuote = Node.create({
  name: "uolBlockQuote",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      quote: { default: "" },
      author: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "blockquote.uol-typography-blockquote",
        getAttrs: (el) => {
          const node = el as HTMLElement;
          const p = node.querySelector("p");
          const cite = node.querySelector("footer cite");
          return {
            quote: p?.textContent ?? "",
            author: cite?.textContent?.replace(/^—\s*/, "") ?? "",
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const { quote, author } = node.attrs as { quote: string; author: string };
    const children: unknown[] = [["p", quote]];
    if (author) {
      children.push(["footer", ["cite", `— ${author}`]]);
    }
    return [
      "blockquote",
      { class: "uol-typography-blockquote" },
      ...children,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BlockQuoteView);
  },

  addCommands() {
    return {
      insertUolBlockQuote:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});
