import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    leedsImage: {
      setLeedsImage: (attrs: {
        src: string;
        alt?: string;
        caption?: string;
      }) => ReturnType;
    };
  }
}

export const LeedsImage = Node.create({
  name: "leedsImage",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: "" },
      alt: { default: "" },
      caption: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure",
        getAttrs: (el) => {
          const node = el as HTMLElement;
          const img = node.querySelector("img");
          const caption = node.querySelector("figcaption");
          if (!img) return false;
          return {
            src: img.getAttribute("src") ?? "",
            alt: img.getAttribute("alt") ?? "",
            caption: caption?.textContent ?? "",
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const { src, alt, caption } = node.attrs as {
      src: string;
      alt: string;
      caption: string;
    };
    const children: (string | object | (string | object)[])[] = [
      ["img", mergeAttributes({ src, alt })],
    ];
    if (caption) {
      children.push(["figcaption", caption]);
    }
    return ["figure", { class: "uol-rich-text__figure" }, ...children];
  },

  addCommands() {
    return {
      setLeedsImage:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs,
          }),
    };
  },
});
