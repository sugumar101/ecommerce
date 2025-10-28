import { Suspense } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import Filters from '@/components/Filters';
import Sort from '@/components/Sort';
import { parseFilterParams, getActiveFilters } from '@/lib/utils/query';
import { getAllProducts } from '@/lib/actions/product';
import { genders, colors, sizes } from '@/lib/db/schema';
import { db } from '@/lib/db';
import { inArray } from 'drizzle-orm';

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getFilterDisplayNames(params: { [key: string]: string | string[] | undefined }) {
  const genderSlugs = params.gender 
    ? (Array.isArray(params.gender) ? params.gender : [params.gender])
    : [];
  const colorSlugs = params.color
    ? (Array.isArray(params.color) ? params.color : [params.color])
    : [];
  const sizeSlugs = params.size
    ? (Array.isArray(params.size) ? params.size : [params.size])
    : [];

  const [genderData, colorData, sizeData] = await Promise.all([
    genderSlugs.length > 0
      ? db.select().from(genders).where(inArray(genders.slug, genderSlugs))
      : Promise.resolve([]),
    colorSlugs.length > 0
      ? db.select().from(colors).where(inArray(colors.slug, colorSlugs))
      : Promise.resolve([]),
    sizeSlugs.length > 0
      ? db.select().from(sizes).where(inArray(sizes.slug, sizeSlugs))
      : Promise.resolve([]),
  ]);

  return {
    genderMap: new Map(genderData.map((g) => [g.slug, g.label])),
    colorMap: new Map(colorData.map((c) => [c.slug, c.name])),
    sizeMap: new Map(sizeData.map((s) => [s.slug, s.name])),
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  
  const searchString = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = Array.isArray(value) ? value.join(',') : value;
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const filterParams = parseFilterParams(params);
  const { products: productList, totalCount } = await getAllProducts(filterParams);
  
  const activeFilters = getActiveFilters(searchString);
  const { genderMap, colorMap, sizeMap } = await getFilterDisplayNames(params);

  const displayProducts = productList.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category,
    brand: product.brand,
    stock: product.stock,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }));

  return (
    <div className="min-h-screen bg-light-200">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark-900 mb-2">All Products</h1>
          <p className="text-dark-700">
            {totalCount} {totalCount === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {activeFilters.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-sm font-medium text-dark-900">Active Filters:</span>
            {activeFilters.map((filter, index) => {
              let displayValue = filter.value;

              if (filter.key === 'gender') {
                displayValue = genderMap.get(filter.value) || filter.value;
              } else if (filter.key === 'color') {
                displayValue = colorMap.get(filter.value) || filter.value;
              } else if (filter.key === 'size') {
                displayValue = sizeMap.get(filter.value) || filter.value;
              }

              return (
                <span
                  key={`${filter.key}-${filter.value}-${index}`}
                  className="inline-flex items-center gap-1 rounded-full bg-dark-900 px-3 py-1 text-sm text-light-100"
                >
                  {displayValue}
                </span>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-64 lg:flex-shrink-0">
            <Suspense fallback={<div>Loading filters...</div>}>
              <Filters />
            </Suspense>
          </aside>

          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-dark-700">
                Showing {displayProducts.length} of {totalCount} products
              </p>
              <Suspense fallback={<div>Loading sort...</div>}>
                <Sort />
              </Suspense>
            </div>

            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {displayProducts.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <ProductCard product={product} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-xl font-semibold text-dark-900 mb-2">No products found</p>
                <p className="text-dark-700 mb-4">
                  Try adjusting your filters to see more results
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
