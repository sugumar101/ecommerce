'use server';

import { db } from '@/lib/db';
import { carts, cartItems } from '@/lib/db/schema/carts';
import { guest } from '@/lib/db/schema/guest';
import { eq, and } from 'drizzle-orm';
import { getSession, getGuestSession, createGuestSession } from '@/lib/auth/actions';
import { CartItemData } from '@/store/cart.store';

interface ActionResult<T = void> {
  success: boolean;
  error?: string;
  data?: T;
}

async function getOrCreateCart(userId?: string, guestSessionToken?: string): Promise<string | null> {
  try {
    let cart;

    if (userId) {
      cart = await db.query.carts.findFirst({
        where: eq(carts.userId, userId),
      });

      if (!cart) {
        const [newCart] = await db.insert(carts).values({
          userId,
        }).returning();
        return newCart.id;
      }
      return cart.id;
    }

    if (guestSessionToken) {
      const guestSession = await db.query.guest.findFirst({
        where: eq(guest.sessionToken, guestSessionToken),
      });

      if (!guestSession) {
        return null;
      }

      cart = await db.query.carts.findFirst({
        where: eq(carts.guestId, guestSession.id),
      });

      if (!cart) {
        const [newCart] = await db.insert(carts).values({
          guestId: guestSession.id,
        }).returning();
        return newCart.id;
      }
      return cart.id;
    }

    return null;
  } catch (error) {
    console.error('Error getting or creating cart:', error);
    return null;
  }
}

export async function getCart(): Promise<ActionResult<{ items: CartItemData[] }>> {
  try {
    const session = await getSession();
    let guestSessionToken = await getGuestSession();

    if (!session && !guestSessionToken) {
      const result = await createGuestSession();
      if (result.success && result.data) {
        guestSessionToken = result.data.sessionToken;
      } else {
        return {
          success: false,
          error: 'Failed to create guest session',
        };
      }
    }

    const cartId = await getOrCreateCart(session?.user?.id, guestSessionToken || undefined);

    if (!cartId) {
      return {
        success: true,
        data: { items: [] },
      };
    }

    const items = await db.query.cartItems.findMany({
      where: eq(cartItems.cartId, cartId),
      with: {
        productVariant: {
          with: {
            product: {
              with: {
                category: true,
              },
            },
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

    const cartItemsData: CartItemData[] = items.map((item) => {
      const variant = item.productVariant;
      const product = variant.product;
      const image = variant.images[0]?.url || '';

      return {
        id: item.id,
        cartId: item.cartId,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        product: {
          id: product.id,
          name: product.name,
          image,
          category: product.category?.name || '',
        },
        variant: {
          id: variant.id,
          sku: variant.sku,
          price: variant.price,
          salePrice: variant.salePrice,
          color: {
            id: variant.color.id,
            name: variant.color.name,
            hexCode: variant.color.hexCode,
          },
          size: {
            id: variant.size.id,
            name: variant.size.name,
          },
        },
      };
    });

    return {
      success: true,
      data: { items: cartItemsData },
    };
  } catch (error) {
    console.error('Error fetching cart:', error);
    return {
      success: false,
      error: 'Failed to fetch cart',
    };
  }
}

export async function addCartItem(
  productVariantId: string,
  quantity: number = 1
): Promise<ActionResult<{ item: CartItemData }>> {
  try {
    const session = await getSession();
    let guestSessionToken = await getGuestSession();

    if (!session && !guestSessionToken) {
      const result = await createGuestSession();
      if (result.success && result.data) {
        guestSessionToken = result.data.sessionToken;
      } else {
        return {
          success: false,
          error: 'Failed to create guest session',
        };
      }
    }

    const cartId = await getOrCreateCart(session?.user?.id, guestSessionToken || undefined);

    if (!cartId) {
      return {
        success: false,
        error: 'Failed to get or create cart',
      };
    }

    const existingItem = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.cartId, cartId),
        eq(cartItems.productVariantId, productVariantId)
      ),
    });

    if (existingItem) {
      const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + quantity })
        .where(eq(cartItems.id, existingItem.id))
        .returning();

      const itemWithDetails = await db.query.cartItems.findFirst({
        where: eq(cartItems.id, updatedItem.id),
        with: {
          productVariant: {
            with: {
              product: {
                with: {
                  category: true,
                },
              },
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

      if (!itemWithDetails) {
        return {
          success: false,
          error: 'Failed to fetch updated item',
        };
      }

      const variant = itemWithDetails.productVariant;
      const product = variant.product;
      const image = variant.images[0]?.url || '';

      return {
        success: true,
        data: {
          item: {
            id: itemWithDetails.id,
            cartId: itemWithDetails.cartId,
            productVariantId: itemWithDetails.productVariantId,
            quantity: itemWithDetails.quantity,
            product: {
              id: product.id,
              name: product.name,
              image,
              category: product.category?.name || '',
            },
            variant: {
              id: variant.id,
              sku: variant.sku,
              price: variant.price,
              salePrice: variant.salePrice,
              color: {
                id: variant.color.id,
                name: variant.color.name,
                hexCode: variant.color.hexCode,
              },
              size: {
                id: variant.size.id,
                name: variant.size.name,
              },
            },
          },
        },
      };
    }

    const [newItem] = await db
      .insert(cartItems)
      .values({
        cartId,
        productVariantId,
        quantity,
      })
      .returning();

    const itemWithDetails = await db.query.cartItems.findFirst({
      where: eq(cartItems.id, newItem.id),
      with: {
        productVariant: {
          with: {
            product: {
              with: {
                category: true,
              },
            },
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

    if (!itemWithDetails) {
      return {
        success: false,
        error: 'Failed to fetch new item',
      };
    }

    const variant = itemWithDetails.productVariant;
    const product = variant.product;
    const image = variant.images[0]?.url || '';

    return {
      success: true,
      data: {
        item: {
          id: itemWithDetails.id,
          cartId: itemWithDetails.cartId,
          productVariantId: itemWithDetails.productVariantId,
          quantity: itemWithDetails.quantity,
          product: {
            id: product.id,
            name: product.name,
            image,
            category: product.category?.name || '',
          },
          variant: {
            id: variant.id,
            sku: variant.sku,
            price: variant.price,
            salePrice: variant.salePrice,
            color: {
              id: variant.color.id,
              name: variant.color.name,
              hexCode: variant.color.hexCode,
            },
            size: {
              id: variant.size.id,
              name: variant.size.name,
            },
          },
        },
      },
    };
  } catch (error) {
    console.error('Error adding cart item:', error);
    return {
      success: false,
      error: 'Failed to add item to cart',
    };
  }
}

export async function updateCartItem(
  itemId: string,
  quantity: number
): Promise<ActionResult> {
  try {
    if (quantity < 1) {
      return {
        success: false,
        error: 'Quantity must be at least 1',
      };
    }

    await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, itemId));

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error updating cart item:', error);
    return {
      success: false,
      error: 'Failed to update cart item',
    };
  }
}

export async function removeCartItem(itemId: string): Promise<ActionResult> {
  try {
    await db.delete(cartItems).where(eq(cartItems.id, itemId));

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error removing cart item:', error);
    return {
      success: false,
      error: 'Failed to remove cart item',
    };
  }
}

export async function clearCart(): Promise<ActionResult> {
  try {
    const session = await getSession();
    const guestSessionToken = await getGuestSession();

    const cartId = await getOrCreateCart(session?.user?.id, guestSessionToken || undefined);

    if (!cartId) {
      return {
        success: true,
      };
    }

    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return {
      success: false,
      error: 'Failed to clear cart',
    };
  }
}

export async function mergeGuestCartToUserCart(userId: string): Promise<ActionResult> {
  try {
    const guestSessionToken = await getGuestSession();

    if (!guestSessionToken) {
      return { success: true };
    }

    const guestSession = await db.query.guest.findFirst({
      where: eq(guest.sessionToken, guestSessionToken),
    });

    if (!guestSession) {
      return { success: true };
    }

    const guestCart = await db.query.carts.findFirst({
      where: eq(carts.guestId, guestSession.id),
      with: {
        items: true,
      },
    });

    if (!guestCart || guestCart.items.length === 0) {
      await db.delete(guest).where(eq(guest.id, guestSession.id));
      return { success: true };
    }

    const userCartId = await getOrCreateCart(userId);

    if (!userCartId) {
      return {
        success: false,
        error: 'Failed to get or create user cart',
      };
    }

    for (const item of guestCart.items) {
      const existingItem = await db.query.cartItems.findFirst({
        where: and(
          eq(cartItems.cartId, userCartId),
          eq(cartItems.productVariantId, item.productVariantId)
        ),
      });

      if (existingItem) {
        await db
          .update(cartItems)
          .set({ quantity: existingItem.quantity + item.quantity })
          .where(eq(cartItems.id, existingItem.id));
      } else {
        await db.insert(cartItems).values({
          cartId: userCartId,
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        });
      }
    }

    await db.delete(carts).where(eq(carts.id, guestCart.id));
    await db.delete(guest).where(eq(guest.id, guestSession.id));

    return { success: true };
  } catch (error) {
    console.error('Error merging guest cart:', error);
    return {
      success: false,
      error: 'Failed to merge guest cart',
    };
  }
}
