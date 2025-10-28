import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const sizes = pgTable('sizes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const insertSizeSchema = createInsertSchema(sizes, {
  name: z.string().min(1, 'Size name is required').max(20),
  slug: z.string().min(1, 'Slug is required').max(20).toLowerCase(),
  sortOrder: z.number().int().min(0),
});

export const selectSizeSchema = createSelectSchema(sizes);

export type Size = z.infer<typeof selectSizeSchema>;
export type InsertSize = z.infer<typeof insertSizeSchema>;
