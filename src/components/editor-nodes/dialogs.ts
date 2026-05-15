import type { DialogConfig } from "../editor-dialog";

export function pullQuoteDialog(
  initial: { quote?: string; align?: string },
  onSubmit: (values: Record<string, string>) => void,
  submitLabel = "Insert"
): DialogConfig {
  return {
    title: "Pull quote (highlighted text)",
    submitLabel,
    fields: [
      {
        name: "quote",
        label: "Quote text",
        type: "textarea",
        required: true,
        placeholder: "A short, attention-grabbing statement…",
        help: "Pulls a key sentence out of the page and styles it for emphasis. For a quote with attribution use Block quote instead.",
      },
      {
        name: "align",
        label: "Alignment",
        type: "select",
        options: [
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
          { label: "Centre", value: "center" },
        ],
      },
    ],
    initial: {
      quote: initial.quote ?? "",
      align: initial.align ?? "left",
    },
    onSubmit,
  };
}

export function blockQuoteDialog(
  initial: { quote?: string; author?: string },
  onSubmit: (values: Record<string, string>) => void,
  submitLabel = "Insert"
): DialogConfig {
  return {
    title: "Block quote with attribution",
    submitLabel,
    fields: [
      {
        name: "quote",
        label: "Quote",
        type: "textarea",
        required: true,
        placeholder: "What was said…",
      },
      {
        name: "author",
        label: "Attribution",
        type: "text",
        placeholder: "Optional — e.g. Dr Jane Smith, Researcher",
        help: "Who said it. Leave blank for a quote without attribution.",
      },
    ],
    initial: { quote: initial.quote ?? "", author: initial.author ?? "" },
    onSubmit,
  };
}

export function leedsImageDialog(
  initial: { src?: string; alt?: string; caption?: string },
  onSubmit: (values: Record<string, string>) => void,
  submitLabel = "Insert"
): DialogConfig {
  return {
    title: "Image",
    submitLabel,
    fields: [
      {
        name: "src",
        label: "Image URL",
        type: "url",
        placeholder: "https://www.leeds.ac.uk/images/…",
        help: "Leave blank for a placeholder. You can replace the placeholder image in JADU after pasting the HTML.",
      },
      {
        name: "alt",
        label: "Alt text",
        type: "text",
        placeholder: "Describe the image for screen readers",
      },
      {
        name: "caption",
        label: "Caption",
        type: "text",
        placeholder: "Optional caption shown below the image",
      },
    ],
    initial: {
      src: initial.src ?? "",
      alt: initial.alt ?? "",
      caption: initial.caption ?? "",
    },
    onSubmit,
  };
}

export function ctaDialog(
  initial: { title?: string; url?: string; text?: string },
  onSubmit: (values: Record<string, string>) => void,
  submitLabel = "Insert"
): DialogConfig {
  return {
    title: "Call to action",
    submitLabel,
    fields: [
      {
        name: "title",
        label: "Heading",
        type: "text",
        required: true,
        placeholder: "Search courses",
      },
      {
        name: "url",
        label: "Link URL",
        type: "url",
        required: true,
        placeholder: "https://courses.leeds.ac.uk",
      },
      {
        name: "text",
        label: "Description",
        type: "text",
        placeholder: "Browse our undergraduate courses.",
      },
    ],
    initial: {
      title: initial.title ?? "",
      url: initial.url ?? "",
      text: initial.text ?? "",
    },
    onSubmit,
  };
}

export function accordionDialog(
  initial: { title?: string },
  onSubmit: (values: Record<string, string>) => void,
  submitLabel = "Insert"
): DialogConfig {
  return {
    title: "Accordion",
    submitLabel,
    fields: [
      {
        name: "title",
        label: "Title (the clickable heading)",
        type: "text",
        required: true,
        placeholder: "What is included in the fees?",
      },
    ],
    initial: { title: initial.title ?? "" },
    onSubmit,
  };
}

export function linkDialog(
  initial: { href?: string },
  onSubmit: (values: Record<string, string>) => void,
  submitLabel = "Insert"
): DialogConfig {
  return {
    title: "Link",
    submitLabel,
    fields: [
      {
        name: "href",
        label: "URL",
        type: "url",
        required: true,
        placeholder: "https://…",
        help: "Leave the value empty in the prompt to remove the link.",
      },
    ],
    initial: { href: initial.href ?? "" },
    onSubmit,
  };
}

export function telLinkDialog(
  initial: { phone?: string },
  onSubmit: (values: Record<string, string>) => void,
  submitLabel = "Insert"
): DialogConfig {
  return {
    title: "Phone link",
    submitLabel,
    fields: [
      {
        name: "phone",
        label: "Phone number",
        type: "text",
        required: true,
        placeholder: "+44 113 343 1751",
        help: "Spaces are stripped automatically; only digits and + are kept.",
      },
    ],
    initial: { phone: initial.phone ?? "" },
    onSubmit,
  };
}

export function abbreviationDialog(
  initial: { title?: string },
  onSubmit: (values: Record<string, string>) => void,
  submitLabel = "Apply"
): DialogConfig {
  return {
    title: "Abbreviation",
    submitLabel,
    fields: [
      {
        name: "title",
        label: "Full term",
        type: "text",
        required: true,
        placeholder: "University of Leeds",
        help: "The full term, shown on hover over the highlighted abbreviation.",
      },
    ],
    initial: { title: initial.title ?? "" },
    onSubmit,
  };
}

export function languageDialog(
  initial: { lang?: string },
  onSubmit: (values: Record<string, string>) => void,
  submitLabel = "Apply"
): DialogConfig {
  return {
    title: "Language tag",
    submitLabel,
    fields: [
      {
        name: "lang",
        label: "Language code (BCP 47)",
        type: "text",
        required: true,
        placeholder: "fr, de, cy, zh-Hans, etc.",
        help: "Used by screen readers to pronounce text correctly when a phrase is in a different language.",
      },
    ],
    initial: { lang: initial.lang ?? "" },
    onSubmit,
  };
}

export function anchorDialog(
  initial: { id?: string },
  onSubmit: (values: Record<string, string>) => void,
  submitLabel = "Insert"
): DialogConfig {
  return {
    title: "Anchor (in-page jump target)",
    submitLabel,
    fields: [
      {
        name: "id",
        label: "Anchor ID",
        type: "text",
        required: true,
        placeholder: "fees-section",
        help: "Letters, digits and dashes only. Link to it elsewhere with href=\"#anchor-id\".",
      },
    ],
    initial: { id: initial.id ?? "" },
    onSubmit,
  };
}

export function timeDialog(
  initial: { datetime?: string; display?: string },
  onSubmit: (values: Record<string, string>) => void,
  submitLabel = "Insert"
): DialogConfig {
  return {
    title: "Date or time",
    submitLabel,
    fields: [
      {
        name: "datetime",
        label: "Date",
        type: "date",
        required: true,
      },
      {
        name: "display",
        label: "Displayed text",
        type: "text",
        placeholder: "4 June 2025",
        help: "How the date should appear in the text. Leave blank to use the date value as-is.",
      },
    ],
    initial: {
      datetime: initial.datetime ?? "",
      display: initial.display ?? "",
    },
    onSubmit,
  };
}
