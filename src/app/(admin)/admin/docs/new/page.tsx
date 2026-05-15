import type { Metadata } from "next";
import { db, categories } from "@/db";
import { DocForm } from "@/components/doc-form";
import { createDoc } from "../actions";

export const metadata: Metadata = { title: "New document | Jadu-CMS" };

export default async function NewDocPage() {
  const cats = await db.select().from(categories).orderBy(categories.name);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">New document</h1>
      <DocForm cats={cats} action={createDoc} submitLabel="Create" />
    </div>
  );
}
