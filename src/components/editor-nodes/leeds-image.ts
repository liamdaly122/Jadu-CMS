import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { LeedsImageView } from "./leeds-image-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    leedsImage: {
      insertLeedsImage: (attrs: {
        src?: string;
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
          if (!node.classList.contains("uol-rich-text__figure")) return false;
          const img = node.querySelector("img");
          const caption = node.querySelector("figcaption");
          return {
            src: img?.getAttribute("src") ?? "",
            alt: img?.getAttribute("alt") ?? "",
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
    const children: unknown[] = [];
    if (src) {
      children.push(["img", mergeAttributes({ src, alt })]);
    } else {
      // Placeholder marker that the author replaces in JADU.
      children.push([
        "img",
        {
          src:
            "data:image/svg+xml;utf8," +
            encodeURIComponent(
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"><rect width="100%" height="100%" fill="#e2e8f0"/><text x="50%" y="50%" font-family="system-ui" font-size="24" fill="#64748b" text-anchor="middle" dominant-baseline="middle">Image placeholder — replace in JADU</text></svg>'
            ),
          alt: alt || "Image placeholder",
          "data-placeholder": "true",
        },
      ]);
    }
    if (caption) {
      children.push(["figcaption", caption]);
    }
    return ["figure", { class: "uol-rich-text__figure" }, ...children];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LeedsImageView);
  },

  addCommands() {
    return {
      insertLeedsImage:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});
