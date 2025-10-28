'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CartItem from './CartItem';
import { useCartStore, CartItemData } from '@/store/cart.store';
import { updateCartItem, removeCartItem } from '@/lib/actions/cart';

interface CartPageClientProps {
  initialItems: CartItemData[];
  isAuthenticated: boolean;
}

export default function CartPageClient({ initialItems, isAuthenticated }: CartPageClientProps) {
  const router = useRouter();
  const { items, setItems, updateItem, removeItem, getSubtotal } = useCartStore();

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems, setItems]);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    updateItem(itemId, quantity);
    
    const result = await updateCartItem(itemId, quantity);
    if (!result.success) {
      console.error('Failed to update cart item:', result.error);
      setItems(initialItems);
    }
  };

  const handleRemove = async (itemId: string) => {
    removeItem(itemId);
    
    const result = await removeCartItem(itemId);
    if (!result.success) {
      console.error('Failed to remove cart item:', result.error);
      setItems(initialItems);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/auth?redirect=/cart');
    } else {
      router.push('/checkout');
    }
  };

  const subtotal = getSubtotal();
  const deliveryFee = 2.00;
  const total = subtotal + deliveryFee;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
          <h2 className="text-2xl font-bold text-dark-900 mb-6">Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-base">
              <span className="text-dark-700">Subtotal</span>
              <span className="font-semibold text-dark-900">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-base">
              <span className="text-dark-700">Estimated Delivery & Handling</span>
              <span className="font-semibold text-dark-900">${deliveryFee.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-light-200 pt-4 mb-6">
            <div className="flex justify-between text-lg">
              <span className="font-semibold text-dark-900">Total</span>
              <span className="font-bold text-dark-900">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full py-4 bg-dark-900 text-light-100 rounded-full text-base font-medium hover:bg-dark-700 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
