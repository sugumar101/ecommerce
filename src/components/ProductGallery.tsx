'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ImageOff, Check } from 'lucide-react';
import { ProductDetailVariant } from '@/lib/data/mockProductDetails';

interface ProductGalleryProps {
  productName: string;
  variants: ProductDetailVariant[];
  defaultVariantId: string;
}

export default function ProductGallery({
  productName,
  variants,
  defaultVariantId,
}: ProductGalleryProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariantId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [brokenUrls, setBrokenUrls] = useState<Set<string>>(new Set());

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const validImages = selectedVariant?.images.filter((url) => !brokenUrls.has(url)) || [];
  
  const safeImageIndex = selectedImageIndex >= validImages.length && validImages.length > 0 
    ? 0 
    : selectedImageIndex;
  
  const currentImage = validImages[safeImageIndex] || null;

  const handleImageError = useCallback((url: string) => {
    setBrokenUrls((prev) => new Set(prev).add(url));
  }, []);

  const handleVariantChange = useCallback((variantId: string) => {
    setSelectedVariantId(variantId);
    setSelectedImageIndex(0);
  }, []);

  const handleThumbnailClick = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (validImages.length === 0) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedImageIndex((prev) => {
          const safePrev = prev >= validImages.length ? 0 : prev;
          return safePrev > 0 ? safePrev - 1 : validImages.length - 1;
        });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedImageIndex((prev) => {
          const safePrev = prev >= validImages.length ? 0 : prev;
          return safePrev < validImages.length - 1 ? safePrev + 1 : 0;
        });
      }
    },
    [validImages.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const variantsWithImages = variants.filter(
    (variant) => variant.images.some((url) => !brokenUrls.has(url))
  );

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-light-200">
        {currentImage ? (
          <Image
            src={currentImage}
            alt={`${productName} - ${selectedVariant?.color.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            priority
            onError={() => handleImageError(currentImage)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <ImageOff className="mx-auto h-16 w-16 text-dark-500" />
              <p className="mt-2 text-sm text-dark-700">No image available</p>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
          {validImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              onClick={() => handleThumbnailClick(index)}
              className={`relative flex-shrink-0 h-20 w-20 overflow-hidden rounded-md border-2 transition-all snap-start focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 ${
                index === safeImageIndex
                  ? 'border-dark-900'
                  : 'border-light-300 hover:border-dark-700'
              }`}
              aria-label={`View image ${index + 1} of ${validImages.length}`}
              aria-current={index === safeImageIndex ? 'true' : 'false'}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                onError={() => handleImageError(image)}
              />
            </button>
          ))}
        </div>
      )}

      {/* Color Swatches */}
      {variantsWithImages.length > 1 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-dark-900">
            Color: {selectedVariant?.color.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {variantsWithImages.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleVariantChange(variant.id)}
                className={`relative h-12 w-12 overflow-hidden rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 ${
                  variant.id === selectedVariantId
                    ? 'border-dark-900'
                    : 'border-light-300 hover:border-dark-700'
                }`}
                aria-label={`Select ${variant.color.name} color`}
                aria-pressed={variant.id === selectedVariantId}
              >
                <div
                  className="h-full w-full"
                  style={{ backgroundColor: variant.color.hexCode }}
                />
                {variant.id === selectedVariantId && (
                  <div className="absolute inset-0 flex items-center justify-center bg-dark-900 bg-opacity-20">
                    <Check className="h-6 w-6 text-light-100" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
