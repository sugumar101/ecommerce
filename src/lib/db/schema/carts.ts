import { pgTable, uuid, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { user } from './user';
import { guest } from './guest';
import { productVariants } from './variants';

export const carts = pgTable('carts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }),
  guestId: uuid('guest_id').references(() => guest.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const cartItems = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  cartId: uuid('cart_id').notNull().references(() => carts.id, { onDelete: 'cascade' }),
  productVariantId: uuid('product_variant_id').notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
});

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(user, {
    fields: [carts.userId],
    references: [user.id],
  }),
  guest: one(guest, {
    fields: [carts.guestId],
    references: [guest.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  productVariant: one(productVariants, {
    fields: [cartItems.productVariantId],
    references: [productVariants.id],
  }),
}));

export const insertCartSchema = createInsertSchema(carts, {
  userId: z.string().uuid().optional(),
  guestId: z.string().uuid().optional(),
});

export const selectCartSchema = createSelectSchema(carts);

export const insertCartItemSchema = createInsertSchema(cartItems, {
  cartId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const selectCartItemSchema = createSelectSchema(cartItems);

export type Cart = z.infer<typeof selectCartSchema>;
export type InsertCart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof selectCartItemSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
