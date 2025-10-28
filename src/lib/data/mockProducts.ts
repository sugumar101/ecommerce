
export interface MockColor {
  id: string;
  name: string;
  slug: string;
  hexCode: string;
}

export interface MockSize {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

export interface MockGender {
  id: string;
  label: string;
  slug: string;
}

export interface MockBrand {
  id: string;
  name: string;
  slug: string;
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
}

export interface MockVariant {
  id: string;
  productId: string;
  sku: string;
  price: string;
  salePrice: string | null;
  colorId: string;
  sizeId: string;
  inStock: number;
}

export interface MockProduct {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  genderId: string;
  brandId: string;
  isPublished: boolean;
  defaultVariantId: string;
  image: string;
  variants: MockVariant[];
}

export const mockGenders: MockGender[] = [
  { id: '1', label: 'Men', slug: 'men' },
  { id: '2', label: 'Women', slug: 'women' },
  { id: '3', label: 'Unisex', slug: 'unisex' },
];

export const mockBrands: MockBrand[] = [
  { id: '1', name: 'Nike', slug: 'nike' },
];

export const mockCategories: MockCategory[] = [
  { id: '1', name: 'Running', slug: 'running' },
  { id: '2', name: 'Basketball', slug: 'basketball' },
  { id: '3', name: 'Training', slug: 'training' },
  { id: '4', name: 'Lifestyle', slug: 'lifestyle' },
  { id: '5', name: 'Soccer', slug: 'soccer' },
];

export const mockColors: MockColor[] = [
  { id: '1', name: 'Black', slug: 'black', hexCode: '#000000' },
  { id: '2', name: 'White', slug: 'white', hexCode: '#FFFFFF' },
  { id: '3', name: 'Red', slug: 'red', hexCode: '#FF0000' },
  { id: '4', name: 'Blue', slug: 'blue', hexCode: '#0000FF' },
  { id: '5', name: 'Green', slug: 'green', hexCode: '#00FF00' },
  { id: '6', name: 'Grey', slug: 'grey', hexCode: '#808080' },
  { id: '7', name: 'Navy', slug: 'navy', hexCode: '#000080' },
  { id: '8', name: 'Pink', slug: 'pink', hexCode: '#FFC0CB' },
  { id: '9', name: 'Orange', slug: 'orange', hexCode: '#FFA500' },
  { id: '10', name: 'Purple', slug: 'purple', hexCode: '#800080' },
];

export const mockSizes: MockSize[] = [
  { id: '1', name: '6', slug: '6', sortOrder: 1 },
  { id: '2', name: '6.5', slug: '6-5', sortOrder: 2 },
  { id: '3', name: '7', slug: '7', sortOrder: 3 },
  { id: '4', name: '7.5', slug: '7-5', sortOrder: 4 },
  { id: '5', name: '8', slug: '8', sortOrder: 5 },
  { id: '6', name: '8.5', slug: '8-5', sortOrder: 6 },
  { id: '7', name: '9', slug: '9', sortOrder: 7 },
  { id: '8', name: '9.5', slug: '9-5', sortOrder: 8 },
  { id: '9', name: '10', slug: '10', sortOrder: 9 },
  { id: '10', name: '10.5', slug: '10-5', sortOrder: 10 },
  { id: '11', name: '11', slug: '11', sortOrder: 11 },
  { id: '12', name: '11.5', slug: '11-5', sortOrder: 12 },
  { id: '13', name: '12', slug: '12', sortOrder: 13 },
  { id: '14', name: '13', slug: '13', sortOrder: 14 },
];

function createVariants(
  productId: string,
  basePrice: string,
  colorIds: string[],
  sizeIds: string[]
): MockVariant[] {
  const variants: MockVariant[] = [];
  let variantIndex = 0;

  colorIds.forEach((colorId) => {
    sizeIds.forEach((sizeId) => {
      const hasDiscount = Math.random() > 0.7;
      const salePrice = hasDiscount
        ? (parseFloat(basePrice) * 0.8).toFixed(2)
        : null;

      variants.push({
        id: `${productId}-v${variantIndex}`,
        productId,
        sku: `SKU-${productId}-${colorId}-${sizeId}`,
        price: basePrice,
        salePrice,
        colorId,
        sizeId,
        inStock: Math.floor(Math.random() * 50) + 10,
      });

      variantIndex++;
    });
  });

  return variants;
}

export const mockProducts: MockProduct[] = [
  {
    id: 'p1',
    name: 'Nike Air Max 270',
    description:
      "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270. The design draws inspiration from Air Max icons, showcasing Nike's greatest innovation with its large window and fresh array of colors.",
    categoryId: '4',
    genderId: '1',
    brandId: '1',
    isPublished: true,
    defaultVariantId: 'p1-v0',
    image: '/shoes/shoe-1.jpg',
    variants: createVariants('p1', '150.00', ['1', '2', '4'], ['5', '6', '7', '8', '9', '10']),
  },
  {
    id: 'p2',
    name: 'Nike Air Force 1 07',
    description:
      'The radiance lives on in the Nike Air Force 1 07, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.',
    categoryId: '4',
    genderId: '3',
    brandId: '1',
    isPublished: true,
    defaultVariantId: 'p2-v0',
    image: '/shoes/shoe-2.webp',
    variants: createVariants('p2', '110.00', ['2', '1', '3'], ['5', '6', '7', '8', '9', '10', '11']),
  },
  {
    id: 'p3',
    name: 'Nike React Infinity Run Flyknit 3',
    description:
      'A comfortable ride for every run. The Nike React Infinity Run Flyknit 3 is designed to help reduce injury and keep you on the run. More foam and improved upper details provide a secure and cushioned feel.',
    categoryId: '1',
    genderId: '1',
    brandId: '1',
    isPublished: true,
    defaultVariantId: 'p3-v0',
    image: '/shoes/shoe-3.webp',
    variants: createVariants('p3', '160.00', ['1', '4', '6'], ['6', '7', '8', '9', '10', '11']),
  },
  {
    id: 'p4',
    name: 'Nike Pegasus 40',
    description:
      "A springy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals. This version has the same responsiveness and neutral support you love but with improved comfort in those sensitive areas.",
    categoryId: '1',
    genderId: '2',
    brandId: '1',
    isPublished: true,
    defaultVariantId: 'p4-v0',
    image: '/shoes/shoe-4.webp',
    variants: createVariants('p4', '140.00', ['8', '2', '1'], ['3', '4', '5', '6', '7', '8']),
  },
  {
    id: 'p5',
    name: 'Nike Dunk Low Retro',
    description:
      'Created for the hardwood but taken to the streets, the Nike Dunk Low Retro returns with crisp overlays and original team colors. This basketball icon channels 80s vibes with premium leather in the upper that looks good and breaks in even better.',
    categoryId: '4',
    genderId: '3',
    brandId: '1',
    isPublished: true,
    defaultVariantId: 'p5-v0',
    image: '/shoes/shoe-5.avif',
    variants: createVariants('p5', '115.00', ['2', '1', '5'], ['5', '6', '7', '8', '9', '10', '11']),
  },
  {
    id: 'p6',
    name: 'Nike LeBron 21',
    description:
      "Designed to help you play fast and efficient, the LeBron 21 is made for your ascent to the top. It's lightweight, low to the ground and turbo-like, with a cushioned midsole that helps you stay in attack mode.",
    categoryId: '2',
    genderId: '1',
    brandId: '1',
    isPublished: true,
    defaultVariantId: 'p6-v0',
    image: '/shoes/shoe-6.avif',
    variants: createVariants('p6', '200.00', ['10', '1', '9'], ['7', '8', '9', '10', '11', '12']),
  },
  {
    id: 'p7',
    name: 'Nike Metcon 9',
    description:
      'The Nike Metcon 9 is our most tested Metcon to date. It helps keep you stable during heavy lifts, agile during explosive movements and comfortable throughout tough workouts, so you can power through your fitness goals.',
    categoryId: '3',
    genderId: '3',
    brandId: '1',
    isPublished: true,
    defaultVariantId: 'p7-v0',
    image: '/shoes/shoe-7.avif',
    variants: createVariants('p7', '150.00', ['1', '2', '3'], ['6', '7', '8', '9', '10', '11']),
  },
  {
    id: 'p8',
    name: 'Nike Blazer Mid 77 Vintage',
    description:
      'In the 70s, Nike was the new shoe on the block. So new in fact, we were still breaking into the basketball scene and testing prototypes on the feet of our local team. The Nike Blazer Mid 77 Vintage returns with a classic look and feel.',
    categoryId: '4',
    genderId: '2',
    brandId: '1',
    isPublished: true,
    defaultVariantId: 'p8-v0',
    image: '/shoes/shoe-8.avif',
    variants: createVariants('p8', '110.00', ['2', '8', '4'], ['3', '4', '5', '6', '7', '8', '9']),
  },
  {
    id: 'p9',
    name: 'Nike ZoomX Vaporfly Next% 3',
    description:
      'Catch em if you can. Giving you race-day speed to conquer any distance, the Nike ZoomX Vaporfly Next% 3 is made for the chasers, the racers and the elevated pacers who cant turn down the thrill of the pursuit.',
    categoryId: '1',
    genderId: '3',
    brandId: '1',
    isPublished: true,
    defaultVariantId: 'p9-v0',
    image: '/shoes/shoe-9.avif',
    variants: createVariants('p9', '250.00', ['9', '4', '2'], ['6', '7', '8', '9', '10', '11', '12']),
  },
  {
    id: 'p10',
    name: 'Nike Tiempo Legend 10 Elite',
    description:
      'Take your skills to the next level with the Nike Tiempo Legend 10 Elite FG. Weve added a Zoom Air unit, made specifically for the beautiful game, and grippy texture up top for better ball control when dribbling, passing and scoring.',
    categoryId: '5',
    genderId: '1',
    brandId: '1',
    isPublished: true,
    defaultVariantId: 'p10-v0',
    image: '/shoes/shoe-10.avif',
    variants: createVariants('p10', '230.00', ['1', '2', '5'], ['7', '8', '9', '10', '11', '12']),
  },
  {
    id: 'p11',
    name: 'Nike Court Vision Low',
    description:
      'Inspired by basketball shoes of the 80s, the Nike Court Vision Low brings back the classic look you love. Rich materials and plush cushioning keep it comfortable while you move through your day.',
    categoryId: '4',
    genderId: '1',
    brandId: '1',
    isPublished: true,
    defaultVariantId: 'p11-v0',
    image: '/shoes/shoe-11.avif',
    variants: createVariants('p11', '75.00', ['2', '1', '7'], ['6', '7', '8', '9', '10', '11']),
  },
  {
    id: 'p12',
    name: 'Nike Air Zoom Pegasus 39 Shield',
    description:
      'Rain, hail, snow, wind—the Nike Air Zoom Pegasus 39 Shield is ready for it all. Its water-repellent finish helps keep you dry while a grippy tread gives you traction on slick surfaces. Sworn enemy of wet and cold, this shoe is a trusty companion.',
    categoryId: '1',
    genderId: '2',
    brandId: '1',
    isPublished: true,
    defaultVariantId: 'p12-v0',
    image: '/shoes/shoe-12.avif',
    variants: createVariants('p12', '140.00', ['1', '6', '8'], ['3', '4', '5', '6', '7', '8', '9']),
  },
  {
    id: 'p13',
    name: 'Nike SB Dunk Low Pro',
    description:
      'Created for the hardwood but taken to the streets, the Nike Dunk Low Pro SB returns with classic details and throwback hoops flair. Its low-cut, padded collar lets you take your game anywhere—in comfort.',
    categoryId: '4',
    genderId: '3',
    brandId: '1',
    isPublished: true,
    defaultVariantId: 'p13-v0',
    image: '/shoes/shoe-13.avif',
    variants: createVariants('p13', '110.00', ['4', '3', '1'], ['6', '7', '8', '9', '10', '11']),
  },
  {
    id: 'p14',
    name: 'Nike Kyrie Infinity',
    description:
      'Specifically tuned for 2-way players who want to go all-out on both ends of the floor, the Kyrie Infinity bridges the best of the past with the latest innovations. It has an updated traction pattern and a revamped cushioning system.',
    categoryId: '2',
    genderId: '1',
    brandId: '1',
    isPublished: true,
    defaultVariantId: 'p14-v0',
    image: '/shoes/shoe-14.avif',
    variants: createVariants('p14', '130.00', ['1', '2', '10'], ['7', '8', '9', '10', '11', '12']),
  },
  {
    id: 'p15',
    name: 'Nike Free Run 5.0',
    description:
      'The Nike Free Run 5.0 is designed to give you a barefoot-like feel with the protection and traction you need. Flexible grooves in the sole expand and contract with every step, while the soft, stretchy upper moves with your foot.',
    categoryId: '1',
    genderId: '2',
    brandId: '1',
    isPublished: true,
    defaultVariantId: 'p15-v0',
    image: '/shoes/shoe-15.avif',
    variants: createVariants('p15', '120.00', ['8', '2', '6'], ['3', '4', '5', '6', '7', '8', '9']),
  },
];

export const priceRanges = [
  { id: '0-100', label: 'Under $100', min: 0, max: 100 },
  { id: '100-150', label: '$100 - $150', min: 100, max: 150 },
  { id: '150-200', label: '$150 - $200', min: 150, max: 200 },
  { id: '200-plus', label: '$200+', min: 200, max: Infinity },
];
