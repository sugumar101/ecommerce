'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItemData } from '@/store/cart.store';
import { useState } from 'react';

interface CartItemProps {
  item: CartItemData;
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const price = parseFloat(item.variant.salePrice || item.variant.price);
  const totalPrice = (price * item.quantity).toFixed(2);

  const handleDecrease = async () => {
    if (item.quantity > 1 && !isUpdating) {
      setIsUpdating(true);
      await onUpdateQuantity(item.id, item.quantity - 1);
      setIsUpdating(false);
    }
  };

  const handleIncrease = async () => {
    if (!isUpdating) {
      setIsUpdating(true);
      await onUpdateQuantity(item.id, item.quantity + 1);
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (!isRemoving) {
      setIsRemoving(true);
      await onRemove(item.id);
    }
  };

  const estimatedArrival = new Date();
  estimatedArrival.setDate(estimatedArrival.getDate() + 14);
  const arrivalDate = estimatedArrival.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="flex gap-4 pb-6 border-b border-light-200 last:border-0">
      <div className="relative w-32 h-32 flex-shrink-0 bg-light-100 rounded-lg overflow-hidden">
        <Image
          src={item.product.image}
          alt={item.product.name}
          fill
          className="object-cover"
          sizes="128px"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <p className="text-sm text-orange mb-1">Estimated arrival {arrivalDate}</p>
          <h3 className="text-lg font-semibold text-dark-900 mb-1">
            {item.product.name}
          </h3>
          <p className="text-sm text-dark-600 mb-2">{item.product.category}</p>
          
          <div className="flex items-center gap-4 text-sm text-dark-700">
            <span>Size {item.variant.size.name}</span>
            <span>Quantity</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrease}
                disabled={isUpdating || item.quantity <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-dark-300 hover:border-dark-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={handleIncrease}
                disabled={isUpdating}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-dark-300 hover:border-dark-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <p className="text-lg font-semibold text-dark-900">${totalPrice}</p>
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="text-red hover:text-red/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
