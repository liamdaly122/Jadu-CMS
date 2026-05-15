import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    language: {
      setLanguage: (attrs: { lang: string }) => ReturnType;
      unsetLanguage: () => ReturnType;
    };
  }
}

export const Language = Mark.create({
  name: "language",
  inclusive: false,

  addAttributes() {
    return {
      lang: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "span[lang]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setLanguage:
        (attrs) =>
        ({ commands }) =>
          commands.setMark(this.name, attrs),
      unsetLanguage:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});
