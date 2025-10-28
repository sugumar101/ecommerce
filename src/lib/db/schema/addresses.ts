import { pgTable, uuid, text, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { user } from './user';
import { orders } from './orders';

export const addressTypeEnum = pgEnum('address_type', ['billing', 'shipping']);

export const addresses = pgTable('addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  type: addressTypeEnum('type').notNull(),
  line1: text('line1').notNull(),
  line2: text('line2'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  country: text('country').notNull(),
  postalCode: text('postal_code').notNull(),
  isDefault: boolean('is_default').notNull().default(false),
});

export const addressesRelations = relations(addresses, ({ one, many }) => ({
  user: one(user, {
    fields: [addresses.userId],
    references: [user.id],
  }),
  ordersAsShipping: many(orders, {
    relationName: 'shipping_address',
  }),
  ordersAsBilling: many(orders, {
    relationName: 'billing_address',
  }),
}));

export const insertAddressSchema = createInsertSchema(addresses, {
  userId: z.string().uuid(),
  type: z.enum(['billing', 'shipping']),
  line1: z.string().min(1, 'Address line 1 is required').max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  country: z.string().min(1, 'Country is required').max(100),
  postalCode: z.string().min(1, 'Postal code is required').max(20),
  isDefault: z.boolean().default(false),
});

export const selectAddressSchema = createSelectSchema(addresses);

export type Address = z.infer<typeof selectAddressSchema>;
export type InsertAddress = z.infer<typeof insertAddressSchema>;
