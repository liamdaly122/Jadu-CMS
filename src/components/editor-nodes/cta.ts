import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CtaView } from "./cta-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    cta: {
      insertCta: (attrs: {
        title: string;
        url: string;
        text: string;
      }) => ReturnType;
    };
  }
}

export const Cta = Node.create({
  name: "cta",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      title: { default: "" },
      url: { default: "#" },
      text: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.uol-widget-container__ctas",
        getAttrs: (el) => {
          const node = el as HTMLElement;
          const link = node.querySelector(
            "a.uol-in-text-cta__link"
          ) as HTMLAnchorElement | null;
          const text = node.querySelector(".uol-in-text-cta__text");
          if (!link) return false;
          return {
            title: link.textContent ?? "",
            url: link.getAttribute("href") ?? "#",
            text: text?.textContent ?? "",
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const { title, url, text } = node.attrs as {
      title: string;
      url: string;
      text: string;
    };
    return [
      "div",
      { class: "uol-widget-container uol-widget-container__ctas" },
      [
        "div",
        { class: "uol-widget uol-widget--ctas" },
        [
          "div",
          { class: "uol-widget__content" },
          [
            "div",
            { class: "uol-in-text-ctas-wrapper" },
            [
              "div",
              { class: "uol-in-text-cta" },
              [
                "h2",
                { class: "uol-in-text-cta__heading" },
                ["a", { class: "uol-in-text-cta__link", href: url }, title],
              ],
              ["p", { class: "uol-in-text-cta__text" }, text],
            ],
          ],
        ],
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CtaView);
  },

  addCommands() {
    return {
      insertCta:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});
