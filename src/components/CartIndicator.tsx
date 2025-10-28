'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart.store';
import { getCart } from '@/lib/actions/cart';

export default function CartIndicator() {
  const { setItems, getTotalItems } = useCartStore();

  useEffect(() => {
    const loadCart = async () => {
      const result = await getCart();
      if (result.success && result.data) {
        setItems(result.data.items);
      }
    };

    loadCart();
  }, [setItems]);

  const totalItems = getTotalItems();

  return (
    <Link
      href="/cart"
      className="text-gray-900 hover:text-gray-600 text-base font-medium transition-colors"
    >
      My Cart ({totalItems})
    </Link>
  );
}
