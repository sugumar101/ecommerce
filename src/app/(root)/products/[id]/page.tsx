import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import ProductGallery from '@/components/ProductGallery';
import SizePicker from '@/components/SizePicker';
import CollapsibleSection from '@/components/CollapsibleSection';
import ProductCard from '@/components/ProductCard';
import { getProductDetail, getRelatedProducts } from '@/lib/data/mockProductDetails';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductDetail(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(id, 4);

  const defaultVariant = product.variants.find((v) => v.id === product.defaultVariantId);
  const currentPrice = defaultVariant?.sizes[0]?.salePrice || product.price;
  const hasDiscount = defaultVariant?.sizes[0]?.salePrice !== null;
  const discountPercentage = hasDiscount && product.compareAtPrice
    ? Math.round(((parseFloat(product.compareAtPrice) - parseFloat(currentPrice)) / parseFloat(product.compareAtPrice)) * 100)
    : 0;

  const allSizes = defaultVariant?.sizes || [];

  return (
    <div className="min-h-screen bg-light-100">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column - Gallery */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <ProductGallery
              productName={product.name}
              variants={product.variants}
              defaultVariantId={product.defaultVariantId}
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

            {/* Product Title & Brand */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-dark-900 lg:text-4xl">
                {product.name}
              </h1>
              <p className="text-base text-dark-700">
                {product.brand.name} • {product.category.name} • {product.gender.label}
              </p>
            </div>

            {/* Price & Discount */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-dark-900">
                ${currentPrice}
              </span>
              {hasDiscount && product.compareAtPrice && (
                <>
                  <span className="text-xl text-dark-500 line-through">
                    ${product.compareAtPrice}
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

            {/* Size Picker */}
            <SizePicker sizes={allSizes} />

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

              <CollapsibleSection title="Reviews">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < 4 ? 'fill-orange text-orange' : 'fill-light-300 text-light-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-dark-900">4.0 out of 5</span>
                    </div>
                    <span className="text-sm text-dark-700">128 reviews</span>
                  </div>
                  <p className="text-sm text-dark-700">
                    Customer reviews help you make informed decisions. Sign in to write a review.
                  </p>
                </div>
              </CollapsibleSection>
            </div>
          </div>
        </div>

        {/* You Might Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-dark-900 mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => {
                const relatedVariant = relatedProduct.variants[0];
                const relatedPrice = relatedVariant?.sizes[0]?.salePrice || relatedProduct.price;
                const relatedImage = relatedVariant?.images[0] || relatedProduct.genericImages[0];

                return (
                  <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                    <ProductCard
                      product={{
                        id: relatedProduct.id,
                        name: relatedProduct.name,
                        description: relatedProduct.description,
                        price: relatedPrice,
                        image: relatedImage,
                        category: relatedProduct.category.name,
                        brand: relatedProduct.brand.name,
                        stock: relatedVariant?.sizes.reduce((sum, s) => sum + s.inStock, 0) || 0,
                        createdAt: null,
                        updatedAt: null,
                      }}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
