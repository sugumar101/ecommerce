import { pgTable, uuid, text, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { products } from './products';
import { productVariants } from './variants';

export const productImages = pgTable('product_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  isPrimary: boolean('is_primary').notNull().default(false),
});

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [productImages.variantId],
    references: [productVariants.id],
  }),
}));

export const insertProductImageSchema = createInsertSchema(productImages, {
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  url: z.string().url('Invalid image URL'),
  sortOrder: z.number().int().min(0).default(0),
  isPrimary: z.boolean().default(false),
});

export const selectProductImageSchema = createSelectSchema(productImages);

export type ProductImage = z.infer<typeof selectProductImageSchema>;
export type InsertProductImage = z.infer<typeof insertProductImageSchema>;
