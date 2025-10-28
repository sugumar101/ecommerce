import { pgTable, uuid, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const brands = pgTable('brands', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logoUrl: text('logo_url'),
});

export const insertBrandSchema = createInsertSchema(brands, {
  name: z.string().min(1, 'Brand name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).toLowerCase(),
  logoUrl: z.string().url('Invalid logo URL').optional(),
});

export const selectBrandSchema = createSelectSchema(brands);

export type Brand = z.infer<typeof selectBrandSchema>;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
