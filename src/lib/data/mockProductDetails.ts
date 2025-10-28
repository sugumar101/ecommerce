import { mockGenders, mockBrands, mockCategories, mockColors } from './mockProducts';

export interface ProductDetailVariant {
  id: string;
  color: {
    id: string;
    name: string;
    slug: string;
    hexCode: string;
  };
  sizes: Array<{
    id: string;
    name: string;
    slug: string;
    inStock: number;
    price: string;
    salePrice: string | null;
  }>;
  images: string[];
}

export interface ProductDetail {
  id: string;
  name: string;
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  gender: {
    id: string;
    label: string;
    slug: string;
  };
  description: string;
  price: string;
  compareAtPrice?: string;
  defaultVariantId: string;
  variants: ProductDetailVariant[];
  genericImages: string[];
}

export const mockProductDetails: Record<string, ProductDetail> = {
  p1: {
    id: 'p1',
    name: 'Nike Air Max 270',
    brand: mockBrands[0],
    category: mockCategories[3],
    gender: mockGenders[0],
    description:
      "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270. The design draws inspiration from Air Max icons, showcasing Nike's greatest innovation with its large window and fresh array of colors.",
    price: '150.00',
    compareAtPrice: '180.00',
    defaultVariantId: 'p1-v1',
    variants: [
      {
        id: 'p1-v1',
        color: mockColors[0],
        sizes: [
          { id: 's1', name: '8', slug: '8', inStock: 15, price: '150.00', salePrice: null },
          { id: 's2', name: '8.5', slug: '8-5', inStock: 12, price: '150.00', salePrice: null },
          { id: 's3', name: '9', slug: '9', inStock: 20, price: '150.00', salePrice: null },
          { id: 's4', name: '9.5', slug: '9-5', inStock: 8, price: '150.00', salePrice: null },
          { id: 's5', name: '10', slug: '10', inStock: 18, price: '150.00', salePrice: null },
          { id: 's6', name: '10.5', slug: '10-5', inStock: 0, price: '150.00', salePrice: null },
          { id: 's7', name: '11', slug: '11', inStock: 10, price: '150.00', salePrice: null },
        ],
        images: [
          '/shoes/shoe-1.jpg',
          '/shoes/shoe-1-alt1.jpg',
          '/shoes/shoe-1-alt2.jpg',
          '/shoes/shoe-1-alt3.jpg',
        ],
      },
      {
        id: 'p1-v2',
        color: mockColors[1],
        sizes: [
          { id: 's1', name: '8', slug: '8', inStock: 10, price: '150.00', salePrice: null },
          { id: 's2', name: '8.5', slug: '8-5', inStock: 15, price: '150.00', salePrice: null },
          { id: 's3', name: '9', slug: '9', inStock: 12, price: '150.00', salePrice: null },
          { id: 's4', name: '9.5', slug: '9-5', inStock: 18, price: '150.00', salePrice: null },
          { id: 's5', name: '10', slug: '10', inStock: 0, price: '150.00', salePrice: null },
          { id: 's6', name: '10.5', slug: '10-5', inStock: 14, price: '150.00', salePrice: null },
          { id: 's7', name: '11', slug: '11', inStock: 16, price: '150.00', salePrice: null },
        ],
        images: [
          '/shoes/shoe-2.webp',
          '/shoes/shoe-2-alt1.webp',
          '/shoes/shoe-2-alt2.webp',
        ],
      },
      {
        id: 'p1-v3',
        color: mockColors[3],
        sizes: [
          { id: 's1', name: '8', slug: '8', inStock: 8, price: '150.00', salePrice: '120.00' },
          { id: 's2', name: '8.5', slug: '8-5', inStock: 10, price: '150.00', salePrice: '120.00' },
          { id: 's3', name: '9', slug: '9', inStock: 15, price: '150.00', salePrice: '120.00' },
          { id: 's4', name: '9.5', slug: '9-5', inStock: 12, price: '150.00', salePrice: '120.00' },
          { id: 's5', name: '10', slug: '10', inStock: 20, price: '150.00', salePrice: '120.00' },
          { id: 's6', name: '10.5', slug: '10-5', inStock: 8, price: '150.00', salePrice: '120.00' },
          { id: 's7', name: '11', slug: '11', inStock: 0, price: '150.00', salePrice: '120.00' },
        ],
        images: [
          '/shoes/shoe-3.webp',
          '/shoes/shoe-3-alt1.webp',
        ],
      },
    ],
    genericImages: ['/shoes/shoe-1.jpg'],
  },
  p2: {
    id: 'p2',
    name: 'Nike Air Force 1 07',
    brand: mockBrands[0],
    category: mockCategories[3],
    gender: mockGenders[2],
    description:
      'The radiance lives on in the Nike Air Force 1 07, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.',
    price: '110.00',
    defaultVariantId: 'p2-v1',
    variants: [
      {
        id: 'p2-v1',
        color: mockColors[1],
        sizes: [
          { id: 's1', name: '7', slug: '7', inStock: 20, price: '110.00', salePrice: null },
          { id: 's2', name: '7.5', slug: '7-5', inStock: 18, price: '110.00', salePrice: null },
          { id: 's3', name: '8', slug: '8', inStock: 25, price: '110.00', salePrice: null },
          { id: 's4', name: '8.5', slug: '8-5', inStock: 22, price: '110.00', salePrice: null },
          { id: 's5', name: '9', slug: '9', inStock: 30, price: '110.00', salePrice: null },
          { id: 's6', name: '9.5', slug: '9-5', inStock: 15, price: '110.00', salePrice: null },
          { id: 's7', name: '10', slug: '10', inStock: 28, price: '110.00', salePrice: null },
          { id: 's8', name: '10.5', slug: '10-5', inStock: 12, price: '110.00', salePrice: null },
        ],
        images: [
          '/shoes/shoe-2.webp',
          '/shoes/shoe-2-alt1.webp',
          '/shoes/shoe-2-alt2.webp',
          '/shoes/shoe-2-alt3.webp',
        ],
      },
      {
        id: 'p2-v2',
        color: mockColors[0],
        sizes: [
          { id: 's1', name: '7', slug: '7', inStock: 15, price: '110.00', salePrice: null },
          { id: 's2', name: '7.5', slug: '7-5', inStock: 12, price: '110.00', salePrice: null },
          { id: 's3', name: '8', slug: '8', inStock: 18, price: '110.00', salePrice: null },
          { id: 's4', name: '8.5', slug: '8-5', inStock: 20, price: '110.00', salePrice: null },
          { id: 's5', name: '9', slug: '9', inStock: 22, price: '110.00', salePrice: null },
          { id: 's6', name: '9.5', slug: '9-5', inStock: 10, price: '110.00', salePrice: null },
          { id: 's7', name: '10', slug: '10', inStock: 25, price: '110.00', salePrice: null },
          { id: 's8', name: '10.5', slug: '10-5', inStock: 8, price: '110.00', salePrice: null },
        ],
        images: [
          '/shoes/shoe-1.jpg',
          '/shoes/shoe-1-alt1.jpg',
        ],
      },
    ],
    genericImages: ['/shoes/shoe-2.webp'],
  },
  p3: {
    id: 'p3',
    name: 'Nike React Infinity Run Flyknit 3',
    brand: mockBrands[0],
    category: mockCategories[0],
    gender: mockGenders[0],
    description:
      'A comfortable ride for every run. The Nike React Infinity Run Flyknit 3 is designed to help reduce injury and keep you on the run. More foam and improved upper details provide a secure and cushioned feel.',
    price: '160.00',
    compareAtPrice: '200.00',
    defaultVariantId: 'p3-v1',
    variants: [
      {
        id: 'p3-v1',
        color: mockColors[0],
        sizes: [
          { id: 's1', name: '8', slug: '8', inStock: 12, price: '160.00', salePrice: '128.00' },
          { id: 's2', name: '8.5', slug: '8-5', inStock: 15, price: '160.00', salePrice: '128.00' },
          { id: 's3', name: '9', slug: '9', inStock: 18, price: '160.00', salePrice: '128.00' },
          { id: 's4', name: '9.5', slug: '9-5', inStock: 10, price: '160.00', salePrice: '128.00' },
          { id: 's5', name: '10', slug: '10', inStock: 20, price: '160.00', salePrice: '128.00' },
          { id: 's6', name: '10.5', slug: '10-5', inStock: 8, price: '160.00', salePrice: '128.00' },
        ],
        images: [
          '/shoes/shoe-3.webp',
          '/shoes/shoe-3-alt1.webp',
          '/shoes/shoe-3-alt2.webp',
        ],
      },
      {
        id: 'p3-v2',
        color: mockColors[3],
        sizes: [
          { id: 's1', name: '8', slug: '8', inStock: 10, price: '160.00', salePrice: '128.00' },
          { id: 's2', name: '8.5', slug: '8-5', inStock: 12, price: '160.00', salePrice: '128.00' },
          { id: 's3', name: '9', slug: '9', inStock: 15, price: '160.00', salePrice: '128.00' },
          { id: 's4', name: '9.5', slug: '9-5', inStock: 8, price: '160.00', salePrice: '128.00' },
          { id: 's5', name: '10', slug: '10', inStock: 18, price: '160.00', salePrice: '128.00' },
          { id: 's6', name: '10.5', slug: '10-5', inStock: 0, price: '160.00', salePrice: '128.00' },
        ],
        images: [
          '/shoes/shoe-4.webp',
          '/shoes/shoe-4-alt1.webp',
        ],
      },
    ],
    genericImages: ['/shoes/shoe-3.webp'],
  },
};

export function getProductDetail(id: string): ProductDetail | null {
  return mockProductDetails[id] || null;
}

export function getRelatedProducts(currentId: string, limit: number = 4): ProductDetail[] {
  return Object.values(mockProductDetails)
    .filter((product) => product.id !== currentId)
    .slice(0, limit);
}
