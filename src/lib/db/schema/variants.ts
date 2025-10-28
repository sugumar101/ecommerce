import { pgTable, uuid, text, numeric, integer, real, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { products } from './products';
import { colors } from './filters/colors';
import { sizes } from './filters/sizes';
import { productImages } from './product-images';
import { cartItems } from './carts';
import { orderItems } from './orders';

export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  sku: text('sku').notNull().unique(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric('sale_price', { precision: 10, scale: 2 }),
  colorId: uuid('color_id').notNull().references(() => colors.id, { onDelete: 'restrict' }),
  sizeId: uuid('size_id').notNull().references(() => sizes.id, { onDelete: 'restrict' }),
  inStock: integer('in_stock').notNull().default(0),
  weight: real('weight'),
  dimensions: jsonb('dimensions').$type<{ length: number; width: number; height: number }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
    relationName: 'product_variants',
  }),
  color: one(colors, {
    fields: [productVariants.colorId],
    references: [colors.id],
  }),
  size: one(sizes, {
    fields: [productVariants.sizeId],
    references: [sizes.id],
  }),
  images: many(productImages),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  productsAsDefault: many(products, {
    relationName: 'default_variant',
  }),
}));

const dimensionsSchema = z.object({
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
});

export const insertProductVariantSchema = createInsertSchema(productVariants, {
  productId: z.string().uuid(),
  sku: z.string().min(1, 'SKU is required').max(100),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  salePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format').optional(),
  colorId: z.string().uuid(),
  sizeId: z.string().uuid(),
  inStock: z.number().int().min(0),
  weight: z.number().positive().optional(),
  dimensions: dimensionsSchema.optional(),
});

export const selectProductVariantSchema = createSelectSchema(productVariants);

export type ProductVariant = z.infer<typeof selectProductVariantSchema>;
export type InsertProductVariant = z.infer<typeof insertProductVariantSchema>;
