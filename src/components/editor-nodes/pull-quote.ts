import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { PullQuoteView } from "./pull-quote-view";

type PullQuoteAlign = "left" | "right" | "center";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pullQuote: {
      insertPullQuote: (attrs: {
        quote: string;
        align?: PullQuoteAlign;
      }) => ReturnType;
      updatePullQuote: (attrs: {
        quote: string;
        align?: PullQuoteAlign;
      }) => ReturnType;
    };
  }
}

function readAlign(el: HTMLElement): PullQuoteAlign {
  if (el.classList.contains("uol-typography-pull-quote--right")) return "right";
  if (el.classList.contains("uol-typography-pull-quote--center")) return "center";
  return "left";
}

export const PullQuote = Node.create({
  name: "pullQuote",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      quote: { default: "" },
      align: { default: "left" as PullQuoteAlign },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.uol-typography-pull-quote",
        getAttrs: (el) => {
          const node = el as HTMLElement;
          const p = node.querySelector("p");
          return {
            quote: p?.textContent ?? "",
            align: readAlign(node),
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const { quote, align } = node.attrs as {
      quote: string;
      align: PullQuoteAlign;
    };
    return [
      "div",
      {
        "aria-hidden": "true",
        class: `uol-typography-pull-quote uol-typography-pull-quote--${align}`,
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
