import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { TimeView } from "./time-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    timeElement: {
      insertTime: (attrs: { datetime: string; display: string }) => ReturnType;
    };
  }
}

function defaultDisplay(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const TimeElement = Node.create({
  name: "timeElement",
  inline: true,
  group: "inline",
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      datetime: { default: "" },
      display: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "time[datetime]",
        getAttrs: (el) => {
          const node = el as HTMLElement;
          return {
            datetime: node.getAttribute("datetime") ?? "",
            display: node.textContent ?? "",
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const { datetime, display } = node.attrs as {
      datetime: string;
      display: string;
    };
    const text = display || defaultDisplay(datetime);
    return ["time", mergeAttributes({ datetime }), text];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TimeView);
  },

  addCommands() {
    return {
      insertTime:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});
