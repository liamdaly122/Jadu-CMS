"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, documents } from "@/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

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
});

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
  };
  return docSchema.parse(raw);
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
  });

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
      updatedAt: new Date(),
    })
    .where(eq(documents.id, id));

  revalidatePath("/admin/docs");
  revalidatePath(`/preview/${slug}`);
}

export async function deleteDoc(id: string) {
  await db.delete(documents).where(eq(documents.id, id));
  revalidatePath("/admin/docs");
  redirect("/admin/docs");
}
