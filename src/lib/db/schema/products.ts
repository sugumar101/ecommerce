import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { categories } from './categories';
import { genders } from './filters/genders';
import { brands } from './filters/brands';
import { productVariants } from './variants';
import { productImages } from './product-images';
import { reviews } from './reviews';
import { wishlists } from './wishlists';
import { productCollections } from './product-collections';

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'restrict' }),
  genderId: uuid('gender_id').notNull().references(() => genders.id, { onDelete: 'restrict' }),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'restrict' }),
  isPublished: boolean('is_published').notNull().default(false),
  defaultVariantId: uuid('default_variant_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  gender: one(genders, {
    fields: [products.genderId],
    references: [genders.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  defaultVariant: one(productVariants, {
    fields: [products.defaultVariantId],
    references: [productVariants.id],
    relationName: 'default_variant',
  }),
  variants: many(productVariants, {
    relationName: 'product_variants',
  }),
  images: many(productImages),
  reviews: many(reviews),
  wishlists: many(wishlists),
  productCollections: many(productCollections),
}));

export const insertProductSchema = createInsertSchema(products, {
  name: z.string().min(1, 'Product name is required').max(200),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().uuid(),
  genderId: z.string().uuid(),
  brandId: z.string().uuid(),
  isPublished: z.boolean().default(false),
  defaultVariantId: z.string().uuid().optional(),
});

export const selectProductSchema = createSelectSchema(products);

export type Product = z.infer<typeof selectProductSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
