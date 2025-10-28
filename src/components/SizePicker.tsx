'use client';

import { useState } from 'react';

interface Size {
  id: string;
  name: string;
  slug: string;
  inStock: number;
}

interface SizePickerProps {
  sizes: Size[];
}

export default function SizePicker({ sizes }: SizePickerProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-dark-900">Select Size</h3>
        <button className="text-sm text-dark-700 hover:text-dark-900 underline">
          Size Guide
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size.id;
          const isOutOfStock = size.inStock === 0;

          return (
            <button
              key={size.id}
              onClick={() => !isOutOfStock && setSelectedSize(size.id)}
              disabled={isOutOfStock}
              className={`relative py-3 px-4 text-sm font-medium rounded-md border-2 transition-all focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 ${
                isOutOfStock
                  ? 'border-light-300 bg-light-200 text-dark-500 cursor-not-allowed line-through'
                  : isSelected
                  ? 'border-dark-900 bg-dark-900 text-light-100'
                  : 'border-light-300 bg-light-100 text-dark-900 hover:border-dark-700'
              }`}
              aria-label={`Size ${size.name}${isOutOfStock ? ' - Out of stock' : ''}`}
              aria-pressed={isSelected}
              aria-disabled={isOutOfStock}
            >
              {size.name}
            </button>
          );
        })}
      </div>
      {selectedSize && (
        <p className="text-sm text-dark-700">
          Selected size: {sizes.find((s) => s.id === selectedSize)?.name}
        </p>
      )}
    </div>
  );
}
