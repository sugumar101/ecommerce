import { pgTable, uuid, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { products } from './products';

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  parentId: uuid('parent_id'),
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'category_parent',
  }),
  children: many(categories, {
    relationName: 'category_parent',
  }),
  products: many(products),
}));

export const insertCategorySchema = createInsertSchema(categories, {
  name: z.string().min(1, 'Category name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).toLowerCase(),
  parentId: z.string().uuid().optional(),
});

export const selectCategorySchema = createSelectSchema(categories);

export type Category = z.infer<typeof selectCategorySchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
