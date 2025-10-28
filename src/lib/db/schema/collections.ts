import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { productCollections } from './product-collections';

export const collections = pgTable('collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
  productCollections: many(productCollections),
}));

export const insertCollectionSchema = createInsertSchema(collections, {
  name: z.string().min(1, 'Collection name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).toLowerCase(),
});

export const selectCollectionSchema = createSelectSchema(collections);

export type Collection = z.infer<typeof selectCollectionSchema>;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;
