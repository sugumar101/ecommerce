import Link from 'next/link';
import Image from 'next/image';
import { getRecommendedProducts } from '@/lib/actions/product';

interface RecommendedSectionProps {
  productId: string;
}

export async function RecommendedSection({ productId }: RecommendedSectionProps) {
  const recommendedProducts = await getRecommendedProducts(productId);

  if (recommendedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-square bg-light-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-dark-500 mb-1">{product.brand}</p>
              <h3 className="font-semibold text-dark-900 mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-dark-600 mb-2">{product.category}</p>
              <p className="font-bold text-dark-900">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
