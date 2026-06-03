"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, documents } from "@/db";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { signShareToken } from "@/lib/auth";

export async function getShareToken(slug: string) {
  return await signShareToken(slug);
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function newId() {
  return crypto.randomUUID();
}

const linkItem = z.object({
  label: z.string().trim().default(""),
  url: z.string().trim().default(""),
});

const contentItem = z.object({
  title: z.string().trim().default(""),
  url: z.string().trim().default(""),
  description: z.string().trim().default(""),
});

const docSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .max(100)
    .regex(/^[a-z0-9-]*$/i, "lowercase letters, digits and dashes only")
    .optional(),
  featuredImageUrl: z.string().trim().url().optional().or(z.literal("")),
  featuredImageAlt: z.string().trim().max(300).optional(),
  contentHtml: z.string().default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  categoryId: z.string().trim().optional().or(z.literal("")),
  metaDescription: z.string().trim().max(500).optional(),
  metaKeywords: z.string().trim().max(500).optional(),
  withLead: z.boolean().default(true),
  rawHtml: z.boolean().default(false),
  relatedLinks: z.array(linkItem).default([]),
  relatedContent: z.array(contentItem).default([]),
});

function parseJson<T>(input: FormDataEntryValue | null, fallback: T): unknown {
  if (typeof input !== "string" || input.length === 0) return fallback;
  try {
    return JSON.parse(input);
  } catch {
    return fallback;
  }
}

function parse(formData: FormData) {
  const raw = {
    title: formData.get("title")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    featuredImageUrl: formData.get("featuredImageUrl")?.toString() ?? "",
    featuredImageAlt: formData.get("featuredImageAlt")?.toString() ?? "",
    contentHtml: formData.get("contentHtml")?.toString() ?? "",
    status: formData.get("status")?.toString() ?? "draft",
    categoryId: formData.get("categoryId")?.toString() ?? "",
    metaDescription: formData.get("metaDescription")?.toString() ?? "",
    metaKeywords: formData.get("metaKeywords")?.toString() ?? "",
    withLead: formData.get("withLead") === "on",
    rawHtml: formData.get("rawHtml") === "on",
    relatedLinks: parseJson(formData.get("relatedLinks"), []),
    relatedContent: parseJson(formData.get("relatedContent"), []),
  };
  const data = docSchema.parse(raw);
  // Drop empty rows so we don't litter the preview with blank items.
  data.relatedLinks = data.relatedLinks.filter(
    (it) => it.label.length > 0 || it.url.length > 0
  );
  data.relatedContent = data.relatedContent.filter(
    (it) =>
      it.title.length > 0 || it.url.length > 0 || it.description.length > 0
  );
  return data;
}

export async function createDoc(formData: FormData) {
  const data = parse(formData);
  const id = newId();
  const slug = data.slug && data.slug.length > 0 ? data.slug : slugify(data.title);

  await db.insert(documents).values({
    id,
    slug,
    title: data.title,
    featuredImageUrl: data.featuredImageUrl || null,
    featuredImageAlt: data.featuredImageAlt || null,
    contentHtml: data.contentHtml,
    status: data.status,
    categoryId: data.categoryId || null,
    metaDescription: data.metaDescription || null,
    metaKeywords: data.metaKeywords || null,
    withLead: data.withLead,
    rawHtml: data.rawHtml,
    relatedLinks: data.relatedLinks,
    relatedContent: data.relatedContent,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/docs");
  redirect(`/admin/docs/${id}/edit`);
}

export async function updateDoc(id: string, formData: FormData) {
  const data = parse(formData);
  const slug = data.slug && data.slug.length > 0 ? data.slug : slugify(data.title);

  await db
    .update(documents)
    .set({
      slug,
      title: data.title,
      featuredImageUrl: data.featuredImageUrl || null,
      featuredImageAlt: data.featuredImageAlt || null,
      contentHtml: data.contentHtml,
      status: data.status,
      categoryId: data.categoryId || null,
      metaDescription: data.metaDescription || null,
      metaKeywords: data.metaKeywords || null,
      withLead: data.withLead,
      rawHtml: data.rawHtml,
      relatedLinks: data.relatedLinks,
      relatedContent: data.relatedContent,
      updatedAt: new Date(),
    })
    .where(eq(documents.id, id));

  revalidatePath("/admin");
  revalidatePath("/admin/docs");
  revalidatePath(`/preview/${slug}`);
}

// Soft-delete: marks deletedAt. Hard delete only happens from the trash page.
export async function deleteDoc(id: string, redirectAfter: boolean = true) {
  await db
    .update(documents)
    .set({ deletedAt: new Date() })
    .where(eq(documents.id, id));
  revalidatePath("/admin");
  revalidatePath("/admin/docs");
  revalidatePath("/admin/trash");
  if (redirectAfter) redirect("/admin/docs");
}

export async function restoreDoc(id: string) {
  await db
    .update(documents)
    .set({ deletedAt: null })
    .where(eq(documents.id, id));
  revalidatePath("/admin");
  revalidatePath("/admin/docs");
  revalidatePath("/admin/trash");
}

export async function permanentlyDeleteDoc(id: string) {
  await db.delete(documents).where(eq(documents.id, id));
  revalidatePath("/admin");
  revalidatePath("/admin/docs");
  revalidatePath("/admin/trash");
}

export async function bulkSoftDelete(ids: string[]) {
  if (ids.length === 0) return;
  await db
    .update(documents)
    .set({ deletedAt: new Date() })
    .where(inArray(documents.id, ids));
  revalidatePath("/admin");
  revalidatePath("/admin/docs");
  revalidatePath("/admin/trash");
}

export async function bulkSetStatus(
  ids: string[],
  status: "draft" | "published"
) {
  if (ids.length === 0) return;
  await db
    .update(documents)
    .set({ status, updatedAt: new Date() })
    .where(inArray(documents.id, ids));
  revalidatePath("/admin");
  revalidatePath("/admin/docs");
}
