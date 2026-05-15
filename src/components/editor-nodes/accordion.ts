import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { AccordionView } from "./accordion-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    accordion: {
      insertAccordion: (attrs: { title: string }) => ReturnType;
    };
  }
}

export const Accordion = Node.create({
  name: "accordion",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      title: { default: "Accordion" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.uol-accordion",
        getAttrs: (el) => {
          const node = el as HTMLElement;
          const h = node.querySelector(".uol-accordion__title");
          return { title: h?.textContent ?? "Accordion" };
        },
        contentElement: ".uol-accordion__content-inner > .uol-rich-text",
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "div",
      { class: "uol-accordion uol-rich-text" },
      ["h2", { class: "uol-accordion__title" }, node.attrs.title],
      [
        "div",
        { class: "uol-accordion__content" },
        [
          "div",
          { class: "uol-accordion__content-inner" },
          ["div", { class: "uol-rich-text" }, 0],
        ],
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AccordionView);
  },

  addCommands() {
    return {
      insertAccordion:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs,
            content: [{ type: "paragraph" }],
          }),
    };
  },
});
