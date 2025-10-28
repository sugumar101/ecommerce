import { pgTable, uuid, text, numeric, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const discountTypeEnum = pgEnum('discount_type', ['percentage', 'fixed']);

export const coupons = pgTable('coupons', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  discountType: discountTypeEnum('discount_type').notNull(),
  discountValue: numeric('discount_value', { precision: 10, scale: 2 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  maxUsage: integer('max_usage').notNull(),
  usedCount: integer('used_count').notNull().default(0),
});

export const insertCouponSchema = createInsertSchema(coupons, {
  code: z.string().min(1, 'Coupon code is required').max(50).toUpperCase(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid discount value'),
  expiresAt: z.date(),
  maxUsage: z.number().int().min(1, 'Max usage must be at least 1'),
  usedCount: z.number().int().min(0).default(0),
});

export const selectCouponSchema = createSelectSchema(coupons);

export type Coupon = z.infer<typeof selectCouponSchema>;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
