"use server";

import { revalidatePath } from "next/cache";
import { db, categories } from "@/db";
import { eq } from "drizzle-orm";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function createCategory(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  if (!name) return;
  await db.insert(categories).values({
    id: crypto.randomUUID(),
    name,
    slug: slugify(name),
  });
  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categories");
}
