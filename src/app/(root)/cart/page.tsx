import Link from 'next/link';
import { getCart } from '@/lib/actions/cart';
import { getSession } from '@/lib/auth/actions';
import CartPageClient from '@/components/CartPageClient';

export default async function CartPage() {
  const session = await getSession();
  const cartResult = await getCart();

  const items = cartResult.success && cartResult.data ? cartResult.data.items : [];

  return (
    <div className="min-h-screen bg-light-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark-900 mb-8">Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-dark-700 mb-6">Your cart is empty</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-dark-900 text-light-100 rounded-md hover:bg-dark-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <CartPageClient initialItems={items} isAuthenticated={!!session} />
        )}
      </div>
    </div>
  );
}
