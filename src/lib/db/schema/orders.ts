import { pgTable, uuid, numeric, integer, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { user } from './user';
import { addresses } from './addresses';
import { productVariants } from './variants';

export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'shipped', 'delivered', 'cancelled']);
export const paymentMethodEnum = pgEnum('payment_method', ['stripe', 'paypal', 'cod']);
export const paymentStatusEnum = pgEnum('payment_status', ['initiated', 'completed', 'failed']);

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'restrict' }),
  status: orderStatusEnum('status').notNull().default('pending'),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  shippingAddressId: uuid('shipping_address_id').notNull().references(() => addresses.id, { onDelete: 'restrict' }),
  billingAddressId: uuid('billing_address_id').notNull().references(() => addresses.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productVariantId: uuid('product_variant_id').notNull().references(() => productVariants.id, { onDelete: 'restrict' }),
  quantity: integer('quantity').notNull(),
  priceAtPurchase: numeric('price_at_purchase', { precision: 10, scale: 2 }).notNull(),
});

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  method: paymentMethodEnum('method').notNull(),
  status: paymentStatusEnum('status').notNull().default('initiated'),
  paidAt: timestamp('paid_at'),
  transactionId: text('transaction_id'),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  shippingAddress: one(addresses, {
    fields: [orders.shippingAddressId],
    references: [addresses.id],
    relationName: 'shipping_address',
  }),
  billingAddress: one(addresses, {
    fields: [orders.billingAddressId],
    references: [addresses.id],
    relationName: 'billing_address',
  }),
  items: many(orderItems),
  payments: many(payments),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  productVariant: one(productVariants, {
    fields: [orderItems.productVariantId],
    references: [productVariants.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

export const insertOrderSchema = createInsertSchema(orders, {
  userId: z.string().uuid(),
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']).default('pending'),
  totalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount'),
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid(),
});

export const selectOrderSchema = createSelectSchema(orders);

export const insertOrderItemSchema = createInsertSchema(orderItems, {
  orderId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number().int().min(1),
  priceAtPurchase: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price'),
});

export const selectOrderItemSchema = createSelectSchema(orderItems);

export const insertPaymentSchema = createInsertSchema(payments, {
  orderId: z.string().uuid(),
  method: z.enum(['stripe', 'paypal', 'cod']),
  status: z.enum(['initiated', 'completed', 'failed']).default('initiated'),
  paidAt: z.date().optional(),
  transactionId: z.string().optional(),
});

export const selectPaymentSchema = createSelectSchema(payments);

export type Order = z.infer<typeof selectOrderSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = z.infer<typeof selectOrderItemSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Payment = z.infer<typeof selectPaymentSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
