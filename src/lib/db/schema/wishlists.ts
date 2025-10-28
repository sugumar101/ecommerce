import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { products } from './products';
import { user } from './user';

export const wishlists = pgTable('wishlists', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  addedAt: timestamp('added_at').notNull().defaultNow(),
});

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(user, {
    fields: [wishlists.userId],
    references: [user.id],
  }),
  product: one(products, {
    fields: [wishlists.productId],
    references: [products.id],
  }),
}));

export const insertWishlistSchema = createInsertSchema(wishlists, {
  userId: z.string().uuid(),
  productId: z.string().uuid(),
});

export const selectWishlistSchema = createSelectSchema(wishlists);

export type Wishlist = z.infer<typeof selectWishlistSchema>;
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
