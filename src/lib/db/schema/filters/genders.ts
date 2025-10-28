import { pgTable, uuid, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const genders = pgTable('genders', {
  id: uuid('id').primaryKey().defaultRandom(),
  label: text('label').notNull(),
  slug: text('slug').notNull().unique(),
});

export const insertGenderSchema = createInsertSchema(genders, {
  label: z.string().min(1, 'Label is required').max(50),
  slug: z.string().min(1, 'Slug is required').max(50).toLowerCase(),
});

export const selectGenderSchema = createSelectSchema(genders);

export type Gender = z.infer<typeof selectGenderSchema>;
export type InsertGender = z.infer<typeof insertGenderSchema>;
