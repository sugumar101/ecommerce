import Link from 'next/link';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { Suspense } from 'react';
import ProductGallery from '@/components/ProductGallery';
import SizePicker from '@/components/SizePicker';
import CollapsibleSection from '@/components/CollapsibleSection';
import { ReviewsSection } from '@/components/ReviewsSection';
import { RecommendedSection } from '@/components/RecommendedSection';
import { getProduct } from '@/lib/actions/product';

export const revalidate = 0;

interface ProductPageProps {
  params: { id: string };
}

function ReviewsSkeleton() {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-b border-light-200 pb-6 animate-pulse">
            <div className="h-4 bg-light-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-light-200 rounded w-48 mb-2"></div>
            <div className="h-16 bg-light-200 rounded"></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecommendedSkeleton() {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
            <div className="aspect-square bg-light-200"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-light-200 rounded w-20"></div>
              <div className="h-4 bg-light-200 rounded"></div>
              <div className="h-4 bg-light-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-light-100 flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <h1 className="text-4xl font-bold text-dark-900">Product Not Found</h1>
          <p className="text-lg text-dark-700">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/products"
            className="inline-block mt-4 px-6 py-3 bg-dark-900 text-light-100 rounded-md hover:bg-dark-700 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  interface ColorGroup {
    color: {
      id: string;
      name: string;
      hexCode: string;
    };
    images: string[];
    variants: typeof product.variants;
  }

  const variantsByColor = product.variants.reduce((acc, variant) => {
    const colorId = variant.color.id;
    if (!acc[colorId]) {
      acc[colorId] = {
        color: variant.color,
        images: variant.images.length > 0 ? variant.images : product.genericImages,
        variants: [],
      };
    }
    acc[colorId].variants.push(variant);
    return acc;
  }, {} as Record<string, ColorGroup>);

  const galleryVariants = Object.values(variantsByColor).map((group) => ({
    id: group.color.id,
    colorName: group.color.name,
    colorHex: group.color.hexCode,
    images: group.images,
  }));

  const prices = product.variants.map((v) => parseFloat(v.salePrice || v.price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const currentPrice = minPrice.toFixed(2);

  const hasDiscount = product.variants.some((v) => v.salePrice !== null);
  const compareAtPrice = hasDiscount ? maxPrice.toFixed(2) : null;
  const discountPercentage = hasDiscount && compareAtPrice
    ? Math.round(((parseFloat(compareAtPrice) - parseFloat(currentPrice)) / parseFloat(compareAtPrice)) * 100)
    : 0;

  const uniqueSizes = Array.from(
    new Map(
      product.variants.map((v) => [v.size.id, { id: v.size.id, name: v.size.name, inStock: v.inStock }])
    ).values()
  );

  return (
    <div className="min-h-screen bg-light-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <ProductGallery
              productName={product.name}
              variants={galleryVariants}
              defaultVariantId={galleryVariants[0]?.id}
            />
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-dark-700">
              <Link href="/" className="hover:text-dark-900 hover:underline">
                Home
              </Link>
              <span>/</span>
              <Link href="/products" className="hover:text-dark-900 hover:underline">
                Products
              </Link>
              <span>/</span>
              <span className="text-dark-900">{product.name}</span>
            </nav>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-dark-900 lg:text-4xl">
                {product.name}
              </h1>
              <p className="text-base text-dark-700">
                {product.brand.name} • {product.category.name} • {product.gender.label}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-dark-900">
                ${currentPrice}
              </span>
              {hasDiscount && compareAtPrice && (
                <>
                  <span className="text-xl text-dark-500 line-through">
                    ${compareAtPrice}
                  </span>
                  <span className="rounded-md bg-red px-2 py-1 text-sm font-medium text-light-100">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Rating (Static UI) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < 4 ? 'fill-orange text-orange' : 'fill-light-300 text-light-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-dark-700">4.0 (128 reviews)</span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <p className="text-base text-dark-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <SizePicker sizes={uniqueSizes} />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 rounded-md bg-dark-900 px-6 py-3 text-base font-medium text-light-100 transition-colors hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2">
                <ShoppingBag className="h-5 w-5" />
                Add to Bag
              </button>
              <button className="flex items-center justify-center rounded-md border-2 border-dark-900 px-6 py-3 text-dark-900 transition-colors hover:bg-light-200 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="rounded-lg bg-light-200 p-4 space-y-2">
              <p className="text-sm font-medium text-dark-900">Free Delivery</p>
              <p className="text-sm text-dark-700">
                Enter your postal code for delivery availability
              </p>
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-0">
              <CollapsibleSection title="Product Details" defaultOpen>
                <div className="space-y-2">
                  <p>
                    Experience ultimate comfort and style with the {product.name}. 
                    Designed for {product.gender.label.toLowerCase()} athletes and lifestyle enthusiasts.
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-3">
                    <li>Premium materials for durability</li>
                    <li>Breathable construction for all-day comfort</li>
                    <li>Iconic Nike design and branding</li>
                    <li>Available in multiple colors and sizes</li>
                  </ul>
                  <div className="mt-4 space-y-1">
                    <p><strong>Category:</strong> {product.category.name}</p>
                    <p><strong>Brand:</strong> {product.brand.name}</p>
                    <p><strong>Gender:</strong> {product.gender.label}</p>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Shipping & Returns">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-dark-900 mb-1">Shipping</p>
                    <p>
                      Free standard shipping on orders over $50. Express shipping available at checkout.
                      Orders typically arrive within 3-5 business days.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-dark-900 mb-1">Returns</p>
                    <p>
                      Free returns within 30 days of purchase. Items must be unworn and in original packaging.
                      Refunds processed within 5-7 business days after we receive your return.
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

            </div>
          </div>
        </div>

        <Suspense fallback={<ReviewsSkeleton />}>
          <ReviewsSection productId={id} />
        </Suspense>

        <Suspense fallback={<RecommendedSkeleton />}>
          <RecommendedSection productId={id} />
        </Suspense>
      </div>
    </div>
  );
}
