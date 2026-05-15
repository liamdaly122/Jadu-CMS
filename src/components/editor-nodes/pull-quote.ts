import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { PullQuoteView } from "./pull-quote-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pullQuote: {
      insertPullQuote: (attrs: { quote: string; author?: string }) => ReturnType;
      updatePullQuote: (attrs: { quote: string; author?: string }) => ReturnType;
    };
  }
}

export const PullQuote = Node.create({
  name: "pullQuote",
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
        tag: "div.uol-typography-pull-quote",
        getAttrs: (el) => {
          const node = el as HTMLElement;
          const p = node.querySelector("p");
          const cite = node.querySelector("cite");
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
    const children: (string | Record<string, string> | unknown[])[] = [
      ["p", quote],
    ];
    if (author) {
      children.push([
        "footer",
        { class: "uol-pull-quote__footer" },
        ["cite", `— ${author}`],
      ]);
    }
    return [
      "div",
      {
        "aria-hidden": "true",
        class: "uol-typography-pull-quote uol-typography-pull-quote--left",
      },
      ...children,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PullQuoteView);
  },

  addCommands() {
    return {
      insertPullQuote:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
      updatePullQuote:
        (attrs) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, attrs),
    };
  },
});
