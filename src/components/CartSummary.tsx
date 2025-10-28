'use client';

import { useState } from 'react';
import { createStripeCheckoutSession } from '@/lib/actions/checkout';
import { Loader2 } from 'lucide-react';

interface CartSummaryProps {
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
}

export default function CartSummary({ subtotal, deliveryFee, total, itemCount }: CartSummaryProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (itemCount === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await createStripeCheckoutSession();

      if (!result.success) {
        setError(result.error || 'Failed to create checkout session');
        setIsLoading(false);
        return;
      }

      if (result.data?.url) {
        window.location.href = result.data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
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

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={isLoading || itemCount === 0}
        className="w-full py-4 bg-dark-900 text-light-100 rounded-full text-base font-medium hover:bg-dark-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          'Proceed to Checkout'
        )}
      </button>

      <p className="text-xs text-dark-600 text-center mt-4">
        You will be redirected to Stripe for secure payment processing
      </p>
    </div>
  );
}
