import { Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
import Filters from '@/components/Filters';
import Sort from '@/components/Sort';
import { parseQueryParams, getActiveFilters } from '@/lib/utils/query';
import {
  mockProducts,
  mockGenders,
  mockColors,
  mockSizes,
  mockCategories,
  priceRanges,
  type MockProduct,
} from '@/lib/data/mockProducts';

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function filterProducts(products: MockProduct[], filters: ReturnType<typeof parseQueryParams>) {
  let filtered = [...products];

  if (filters.gender) {
    const genderSlugs = Array.isArray(filters.gender) ? filters.gender : [filters.gender];
    filtered = filtered.filter((product) => {
      const gender = mockGenders.find((g) => g.id === product.genderId);
      return gender && genderSlugs.includes(gender.slug);
    });
  }

  if (filters.size) {
    const sizeSlugs = Array.isArray(filters.size) ? filters.size : [filters.size];
    filtered = filtered.filter((product) => {
      return product.variants.some((variant) => {
        const size = mockSizes.find((s) => s.id === variant.sizeId);
        return size && sizeSlugs.includes(size.slug);
      });
    });
  }

  if (filters.color) {
    const colorSlugs = Array.isArray(filters.color) ? filters.color : [filters.color];
    filtered = filtered.filter((product) => {
      return product.variants.some((variant) => {
        const color = mockColors.find((c) => c.id === variant.colorId);
        return color && colorSlugs.includes(color.slug);
      });
    });
  }

  if (filters.priceRange) {
    const priceRangeIds = Array.isArray(filters.priceRange)
      ? filters.priceRange
      : [filters.priceRange];

    filtered = filtered.filter((product) => {
      const minPrice = Math.min(
        ...product.variants.map((v) => parseFloat(v.salePrice || v.price))
      );

      return priceRangeIds.some((rangeId) => {
        const range = priceRanges.find((r) => r.id === rangeId);
        if (!range) return false;
        return minPrice >= range.min && minPrice < range.max;
      });
    });
  }

  return filtered;
}

function sortProducts(products: MockProduct[], sortBy?: string) {
  const sorted = [...products];

  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => {
        const aPrice = Math.min(...a.variants.map((v) => parseFloat(v.salePrice || v.price)));
        const bPrice = Math.min(...b.variants.map((v) => parseFloat(v.salePrice || v.price)));
        return aPrice - bPrice;
      });

    case 'price_desc':
      return sorted.sort((a, b) => {
        const aPrice = Math.min(...a.variants.map((v) => parseFloat(v.salePrice || v.price)));
        const bPrice = Math.min(...b.variants.map((v) => parseFloat(v.salePrice || v.price)));
        return bPrice - aPrice;
      });

    case 'newest':
      return sorted.reverse();

    case 'featured':
    default:
      return sorted;
  }
}

function getProductDisplayData(product: MockProduct) {
  const gender = mockGenders.find((g) => g.id === product.genderId);
  const category = mockCategories.find((c) => c.id === product.categoryId);
  const minPrice = Math.min(...product.variants.map((v) => parseFloat(v.salePrice || v.price)));
  const maxStock = Math.max(...product.variants.map((v) => v.inStock));

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: minPrice.toFixed(2),
    image: product.image,
    brand: 'Nike',
    category: category?.name || 'Unknown',
    stock: maxStock,
    gender: gender?.label || 'Unknown',
    createdAt: new Date(),
    updatedAt: new Date(),
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

  const filters = parseQueryParams(searchString);
  const activeFilters = getActiveFilters(searchString);

  let filteredProducts = filterProducts(mockProducts, filters);
  filteredProducts = sortProducts(filteredProducts, filters.sort);

  const displayProducts = filteredProducts.map(getProductDisplayData);

  return (
    <div className="min-h-screen bg-light-200">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark-900 mb-2">All Products</h1>
          <p className="text-dark-700">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-sm font-medium text-dark-900">Active Filters:</span>
            {activeFilters.map((filter, index) => {
              let displayValue = filter.value;

              if (filter.key === 'gender') {
                const gender = mockGenders.find((g) => g.slug === filter.value);
                displayValue = gender?.label || filter.value;
              } else if (filter.key === 'color') {
                const color = mockColors.find((c) => c.slug === filter.value);
                displayValue = color?.name || filter.value;
              } else if (filter.key === 'size') {
                const size = mockSizes.find((s) => s.slug === filter.value);
                displayValue = size?.name || filter.value;
              } else if (filter.key === 'priceRange') {
                const range = priceRanges.find((r) => r.id === filter.value);
                displayValue = range?.label || filter.value;
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
          {/* Filters Sidebar */}
          <aside className="lg:w-64 lg:flex-shrink-0">
            <Suspense fallback={<div>Loading filters...</div>}>
              <Filters />
            </Suspense>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort Controls */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-dark-700">
                Showing {displayProducts.length} of {mockProducts.length} products
              </p>
              <Suspense fallback={<div>Loading sort...</div>}>
                <Sort />
              </Suspense>
            </div>

            {/* Products Grid */}
            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
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
