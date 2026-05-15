import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  parentId: text("parent_id"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  featuredImageUrl: text("featured_image_url"),
  featuredImageAlt: text("featured_image_alt"),
  contentJson: text("content_json", { mode: "json" })
    .$type<unknown>()
    .default(sql`'null'`),
  contentHtml: text("content_html").notNull().default(""),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  categoryId: text("category_id"),
  relatedLinks: text("related_links", { mode: "json" })
    .$type<{ label: string; url: string }[]>()
    .notNull()
    .default(sql`'[]'`),
  relatedContent: text("related_content", { mode: "json" })
    .$type<{ title: string; url: string; description: string }[]>()
    .notNull()
    .default(sql`'[]'`),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  withLead: integer("with_lead", { mode: "boolean" })
    .notNull()
    .default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
});

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
