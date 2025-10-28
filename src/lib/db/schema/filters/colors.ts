import { pgTable, uuid, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const colors = pgTable('colors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  hexCode: text('hex_code').notNull(),
});

export const insertColorSchema = createInsertSchema(colors, {
  name: z.string().min(1, 'Color name is required').max(50),
  slug: z.string().min(1, 'Slug is required').max(50).toLowerCase(),
  hexCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color code'),
});

export const selectColorSchema = createSelectSchema(colors);

export type Color = z.infer<typeof selectColorSchema>;
export type InsertColor = z.infer<typeof insertColorSchema>;
