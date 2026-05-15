import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { PullQuoteView } from "./pull-quote-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pullQuote: {
      insertPullQuote: (attrs: { quote: string }) => ReturnType;
      updatePullQuote: (attrs: { quote: string }) => ReturnType;
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
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.uol-typography-pull-quote",
        getAttrs: (el) => {
          const node = el as HTMLElement;
          const p = node.querySelector("p");
          return { quote: p?.textContent ?? "" };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const { quote } = node.attrs as { quote: string };
    return [
      "div",
      {
        "aria-hidden": "true",
        class: "uol-typography-pull-quote uol-typography-pull-quote--left",
      },
      ["p", quote],
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
