import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    abbreviation: {
      setAbbreviation: (attrs: { title: string }) => ReturnType;
      unsetAbbreviation: () => ReturnType;
    };
  }
}

export const Abbreviation = Mark.create({
  name: "abbreviation",
  inclusive: false,

  addAttributes() {
    return {
      title: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "abbr[title]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["abbr", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setAbbreviation:
        (attrs) =>
        ({ commands }) =>
          commands.setMark(this.name, attrs),
      unsetAbbreviation:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});
