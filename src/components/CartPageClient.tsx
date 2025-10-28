'use client';

import { useEffect } from 'react';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { useCartStore, CartItemData } from '@/store/cart.store';
import { updateCartItem, removeCartItem } from '@/lib/actions/cart';

interface CartPageClientProps {
  initialItems: CartItemData[];
  isAuthenticated: boolean;
}

export default function CartPageClient({ initialItems }: CartPageClientProps) {
  const { items, setItems, updateItem, removeItem, getSubtotal, getTotalItems } = useCartStore();

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

  const subtotal = getSubtotal();
  const deliveryFee = 2.00;
  const total = subtotal + deliveryFee;
  const itemCount = getTotalItems();

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
        <CartSummary
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          itemCount={itemCount}
        />
      </div>
    </div>
  );
}
