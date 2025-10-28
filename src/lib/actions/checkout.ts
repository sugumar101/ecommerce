'use server';

import { stripe } from '@/lib/stripe/client';
import { db } from '@/lib/db';
import { carts, cartItems } from '@/lib/db/schema/carts';
import { eq } from 'drizzle-orm';
import { getSession, getGuestSession } from '@/lib/auth/actions';
import { guest } from '@/lib/db/schema/guest';

interface ActionResult<T = void> {
  success: boolean;
  error?: string;
  data?: T;
}

export async function createStripeCheckoutSession(): Promise<ActionResult<{ url: string }>> {
  try {
    const session = await getSession();
    const guestSessionToken = await getGuestSession();

    if (!session && !guestSessionToken) {
      return {
        success: false,
        error: 'No session found. Please login or continue as guest.',
      };
    }

    let cartId: string | null = null;

    if (session?.user?.id) {
      const cart = await db.query.carts.findFirst({
        where: eq(carts.userId, session.user.id),
      });
      cartId = cart?.id || null;
    } else if (guestSessionToken) {
      const guestSession = await db.query.guest.findFirst({
        where: eq(guest.sessionToken, guestSessionToken),
      });

      if (guestSession) {
        const cart = await db.query.carts.findFirst({
          where: eq(carts.guestId, guestSession.id),
        });
        cartId = cart?.id || null;
      }
    }

    if (!cartId) {
      return {
        success: false,
        error: 'Cart not found',
      };
    }

    const items = await db.query.cartItems.findMany({
      where: eq(cartItems.cartId, cartId),
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
    });

    if (items.length === 0) {
      return {
        success: false,
        error: 'Cart is empty',
      };
    }

    const lineItems = items.map((item) => {
      const variant = item.productVariant;
      const product = variant.product;
      const price = parseFloat(variant.salePrice || variant.price);
      const priceInCents = Math.round(price * 100);

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: `${variant.color.name} / ${variant.size.name}`,
            images: variant.images[0]?.url ? [variant.images[0].url] : [],
          },
          unit_amount: priceInCents,
        },
        quantity: item.quantity,
      };
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: {
        cartId,
        userId: session?.user?.id || '',
        guestSessionToken: guestSessionToken || '',
      },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'],
      },
      phone_number_collection: {
        enabled: true,
      },
    });

    if (!checkoutSession.url) {
      return {
        success: false,
        error: 'Failed to create checkout session',
      };
    }

    return {
      success: true,
      data: { url: checkoutSession.url },
    };
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return {
      success: false,
      error: 'Failed to create checkout session',
    };
  }
}
