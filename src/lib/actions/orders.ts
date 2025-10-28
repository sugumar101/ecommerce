'use server';

import { db } from '@/lib/db';
import { orders, orderItems, payments } from '@/lib/db/schema/orders';
import { addresses } from '@/lib/db/schema/addresses';
import { carts, cartItems } from '@/lib/db/schema/carts';
import { eq } from 'drizzle-orm';
import { stripe } from '@/lib/stripe/client';
import Stripe from 'stripe';

interface ActionResult<T = void> {
  success: boolean;
  error?: string;
  data?: T;
}

interface OrderDetails {
  id: string;
  status: string;
  totalAmount: string;
  createdAt: Date;
  items: Array<{
    id: string;
    quantity: number;
    priceAtPurchase: string;
    productVariant: {
      id: string;
      sku: string;
      product: {
        id: string;
        name: string;
      };
      color: {
        id: string;
        name: string;
        hexCode: string;
      };
      size: {
        id: string;
        name: string;
      };
      images: Array<{
        url: string;
      }>;
    };
  }>;
  shippingAddress: {
    id: string;
    fullName: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string | null;
  };
  payment: {
    id: string;
    method: string;
    status: string;
    transactionId: string | null;
    paidAt: Date | null;
  } | null;
}

export async function createOrder(stripeSessionId: string): Promise<ActionResult<{ orderId: string }>> {
  try {
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId, {
      expand: ['line_items', 'customer_details', 'shipping_details'],
    });

    if (session.payment_status !== 'paid') {
      return {
        success: false,
        error: 'Payment not completed',
      };
    }

    const { cartId, userId } = session.metadata as { cartId: string; userId: string };

    if (!cartId || !userId) {
      return {
        success: false,
        error: 'Missing cart or user information',
      };
    }

    const existingPayment = await db.query.payments.findFirst({
      where: eq(payments.transactionId, stripeSessionId),
    });

    if (existingPayment) {
      return {
        success: true,
        data: { orderId: existingPayment.orderId },
      };
    }

    const items = await db.query.cartItems.findMany({
      where: eq(cartItems.cartId, cartId),
      with: {
        productVariant: {
          with: {
            product: true,
          },
        },
      },
    });

    if (items.length === 0) {
      return {
        success: false,
        error: 'Cart is empty',
      };
    }

    const shippingDetails = session.shipping_details as Stripe.Checkout.Session.ShippingDetails;
    const [shippingAddress] = await db.insert(addresses).values({
      userId,
      fullName: shippingDetails.name || '',
      addressLine1: shippingDetails.address?.line1 || '',
      addressLine2: shippingDetails.address?.line2 || null,
      city: shippingDetails.address?.city || '',
      state: shippingDetails.address?.state || '',
      postalCode: shippingDetails.address?.postal_code || '',
      country: shippingDetails.address?.country || '',
      phoneNumber: session.customer_details?.phone || null,
    }).returning();

    const [billingAddress] = await db.insert(addresses).values({
      userId,
      fullName: shippingDetails.name || '',
      addressLine1: shippingDetails.address?.line1 || '',
      addressLine2: shippingDetails.address?.line2 || null,
      city: shippingDetails.address?.city || '',
      state: shippingDetails.address?.state || '',
      postalCode: shippingDetails.address?.postal_code || '',
      country: shippingDetails.address?.country || '',
      phoneNumber: session.customer_details?.phone || null,
    }).returning();

    const totalAmount = (session.amount_total || 0) / 100;

    const [order] = await db.insert(orders).values({
      userId,
      status: 'paid',
      totalAmount: totalAmount.toFixed(2),
      shippingAddressId: shippingAddress.id,
      billingAddressId: billingAddress.id,
    }).returning();

    for (const item of items) {
      const variant = item.productVariant;
      const price = parseFloat(variant.salePrice || variant.price);

      await db.insert(orderItems).values({
        orderId: order.id,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        priceAtPurchase: price.toFixed(2),
      });
    }

    await db.insert(payments).values({
      orderId: order.id,
      method: 'stripe',
      status: 'completed',
      transactionId: stripeSessionId,
      paidAt: new Date(),
    });

    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    await db.delete(carts).where(eq(carts.id, cartId));

    return {
      success: true,
      data: { orderId: order.id },
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: 'Failed to create order',
    };
  }
}

export async function getOrder(orderId: string): Promise<ActionResult<{ order: OrderDetails }>> {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        items: {
          with: {
            productVariant: {
              with: {
                product: true,
                color: true,
                size: true,
                images: {
                  orderBy: (images, { desc, asc }) => [desc(images.isPrimary), asc(images.sortOrder)],
                  limit: 1,
                },
              },
            },
          },
        },
        shippingAddress: true,
        payments: true,
      },
    });

    if (!order) {
      return {
        success: false,
        error: 'Order not found',
      };
    }

    const orderDetails: OrderDetails = {
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
        productVariant: {
          id: item.productVariant.id,
          sku: item.productVariant.sku,
          product: {
            id: item.productVariant.product.id,
            name: item.productVariant.product.name,
          },
          color: {
            id: item.productVariant.color.id,
            name: item.productVariant.color.name,
            hexCode: item.productVariant.color.hexCode,
          },
          size: {
            id: item.productVariant.size.id,
            name: item.productVariant.size.name,
          },
          images: item.productVariant.images.map((img) => ({
            url: img.url,
          })),
        },
      })),
      shippingAddress: {
        id: order.shippingAddress.id,
        fullName: order.shippingAddress.fullName,
        addressLine1: order.shippingAddress.addressLine1,
        addressLine2: order.shippingAddress.addressLine2,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        postalCode: order.shippingAddress.postalCode,
        country: order.shippingAddress.country,
        phoneNumber: order.shippingAddress.phoneNumber,
      },
      payment: order.payments[0] ? {
        id: order.payments[0].id,
        method: order.payments[0].method,
        status: order.payments[0].status,
        transactionId: order.payments[0].transactionId,
        paidAt: order.payments[0].paidAt,
      } : null,
    };

    return {
      success: true,
      data: { order: orderDetails },
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return {
      success: false,
      error: 'Failed to fetch order',
    };
  }
}

export async function getOrderByStripeSession(sessionId: string): Promise<ActionResult<{ order: OrderDetails }>> {
  try {
    const payment = await db.query.payments.findFirst({
      where: eq(payments.transactionId, sessionId),
    });

    if (!payment) {
      return {
        success: false,
        error: 'Order not found',
      };
    }

    return getOrder(payment.orderId);
  } catch (error) {
    console.error('Error fetching order by session:', error);
    return {
      success: false,
      error: 'Failed to fetch order',
    };
  }
}
