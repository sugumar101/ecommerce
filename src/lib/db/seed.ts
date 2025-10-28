import { db } from './index';
import {
  genders,
  brands,
  colors,
  sizes,
  categories,
  collections,
  products,
  productVariants,
  productImages,
  productCollections,
} from './schema';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    console.log('📦 Seeding genders...');
    const [menGender, womenGender, unisexGender] = await db
      .insert(genders)
      .values([
        { label: 'Men', slug: 'men' },
        { label: 'Women', slug: 'women' },
        { label: 'Unisex', slug: 'unisex' },
      ])
      .returning();

    console.log('🏢 Seeding brands...');
    const [nikeBrand] = await db
      .insert(brands)
      .values([
        {
          name: 'Nike',
          slug: 'nike',
          logoUrl: '/nike-swoosh.svg',
        },
      ])
      .returning();

    console.log('🎨 Seeding colors...');
    const colorData = await db
      .insert(colors)
      .values([
        { name: 'Black', slug: 'black', hexCode: '#000000' },
        { name: 'White', slug: 'white', hexCode: '#FFFFFF' },
        { name: 'Red', slug: 'red', hexCode: '#FF0000' },
        { name: 'Blue', slug: 'blue', hexCode: '#0000FF' },
        { name: 'Green', slug: 'green', hexCode: '#00FF00' },
        { name: 'Grey', slug: 'grey', hexCode: '#808080' },
        { name: 'Navy', slug: 'navy', hexCode: '#000080' },
        { name: 'Pink', slug: 'pink', hexCode: '#FFC0CB' },
        { name: 'Orange', slug: 'orange', hexCode: '#FFA500' },
        { name: 'Purple', slug: 'purple', hexCode: '#800080' },
      ])
      .returning();

    console.log('📏 Seeding sizes...');
    const sizeData = await db
      .insert(sizes)
      .values([
        { name: '6', slug: '6', sortOrder: 1 },
        { name: '6.5', slug: '6-5', sortOrder: 2 },
        { name: '7', slug: '7', sortOrder: 3 },
        { name: '7.5', slug: '7-5', sortOrder: 4 },
        { name: '8', slug: '8', sortOrder: 5 },
        { name: '8.5', slug: '8-5', sortOrder: 6 },
        { name: '9', slug: '9', sortOrder: 7 },
        { name: '9.5', slug: '9-5', sortOrder: 8 },
        { name: '10', slug: '10', sortOrder: 9 },
        { name: '10.5', slug: '10-5', sortOrder: 10 },
        { name: '11', slug: '11', sortOrder: 11 },
        { name: '11.5', slug: '11-5', sortOrder: 12 },
        { name: '12', slug: '12', sortOrder: 13 },
        { name: '13', slug: '13', sortOrder: 14 },
      ])
      .returning();

    console.log('📂 Seeding categories...');
    const categoryData = await db
      .insert(categories)
      .values([
        { name: 'Running', slug: 'running' },
        { name: 'Basketball', slug: 'basketball' },
        { name: 'Training', slug: 'training' },
        { name: 'Lifestyle', slug: 'lifestyle' },
        { name: 'Soccer', slug: 'soccer' },
      ])
      .returning();

    console.log('🎯 Seeding collections...');
    const collectionData = await db
      .insert(collections)
      .values([
        { name: 'New Arrivals', slug: 'new-arrivals' },
        { name: 'Best Sellers', slug: 'best-sellers' },
        { name: 'Summer 2025', slug: 'summer-2025' },
      ])
      .returning();

    console.log('👟 Seeding products...');

    const productsData = [
      {
        name: 'Nike Air Max 270',
        description:
          "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270. The design draws inspiration from Air Max icons, showcasing Nike's greatest innovation with its large window and fresh array of colors.",
        categoryId: categoryData[3].id,
        genderId: menGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        colors: ['Black', 'White', 'Blue'],
        basePrice: '150.00',
      },
      {
        name: 'Nike Air Force 1 07',
        description:
          'The radiance lives on in the Nike Air Force 1 07, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.',
        categoryId: categoryData[3].id,
        genderId: unisexGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        colors: ['White', 'Black', 'Red'],
        basePrice: '110.00',
      },
      {
        name: 'Nike React Infinity Run Flyknit 3',
        description:
          'A comfortable ride for every run. The Nike React Infinity Run Flyknit 3 is designed to help reduce injury and keep you on the run. More foam and improved upper details provide a secure and cushioned feel.',
        categoryId: categoryData[0].id,
        genderId: menGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        colors: ['Black', 'Blue', 'Grey'],
        basePrice: '160.00',
      },
      {
        name: 'Nike Pegasus 40',
        description:
          "A springy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals. This version has the same responsiveness and neutral support you love but with improved comfort in those sensitive areas.",
        categoryId: categoryData[0].id,
        genderId: womenGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        colors: ['Pink', 'White', 'Black'],
        basePrice: '140.00',
      },
      {
        name: 'Nike Dunk Low Retro',
        description:
          'Created for the hardwood but taken to the streets, the Nike Dunk Low Retro returns with crisp overlays and original team colors. This basketball icon channels 80s vibes with premium leather in the upper that looks good and breaks in even better.',
        categoryId: categoryData[3].id,
        genderId: unisexGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        colors: ['White', 'Black', 'Green'],
        basePrice: '115.00',
      },
      {
        name: 'Nike LeBron 21',
        description:
          "Designed to help you play fast and efficient, the LeBron 21 is made for your ascent to the top. It's lightweight, low to the ground and turbo-like, with a cushioned midsole that helps you stay in attack mode.",
        categoryId: categoryData[1].id,
        genderId: menGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        colors: ['Purple', 'Black', 'Orange'],
        basePrice: '200.00',
      },
      {
        name: 'Nike Metcon 9',
        description:
          'The Nike Metcon 9 is our most tested Metcon to date. It helps keep you stable during heavy lifts, agile during explosive movements and comfortable throughout tough workouts, so you can power through your fitness goals.',
        categoryId: categoryData[2].id,
        genderId: unisexGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        colors: ['Black', 'White', 'Red'],
        basePrice: '150.00',
      },
      {
        name: 'Nike Blazer Mid 77 Vintage',
        description:
          'In the 70s, Nike was the new shoe on the block. So new in fact, we were still breaking into the basketball scene and testing prototypes on the feet of our local team. The Nike Blazer Mid 77 Vintage returns with a classic look and feel.',
        categoryId: categoryData[3].id,
        genderId: womenGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        colors: ['White', 'Pink', 'Blue'],
        basePrice: '110.00',
      },
      {
        name: 'Nike ZoomX Vaporfly Next% 3',
        description:
          'Catch em if you can. Giving you race-day speed to conquer any distance, the Nike ZoomX Vaporfly Next% 3 is made for the chasers, the racers and the elevated pacers who cant turn down the thrill of the pursuit.',
        categoryId: categoryData[0].id,
        genderId: unisexGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        colors: ['Orange', 'Blue', 'White'],
        basePrice: '250.00',
      },
      {
        name: 'Nike Tiempo Legend 10 Elite',
        description:
          'Take your skills to the next level with the Nike Tiempo Legend 10 Elite FG. Weve added a Zoom Air unit, made specifically for the beautiful game, and grippy texture up top for better ball control when dribbling, passing and scoring.',
        categoryId: categoryData[4].id,
        genderId: menGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        colors: ['Black', 'White', 'Green'],
        basePrice: '230.00',
      },
      {
        name: 'Nike Court Vision Low',
        description:
          'Inspired by basketball shoes of the 80s, the Nike Court Vision Low brings back the classic look you love. Rich materials and plush cushioning keep it comfortable while you move through your day.',
        categoryId: categoryData[3].id,
        genderId: menGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        colors: ['White', 'Black', 'Navy'],
        basePrice: '75.00',
      },
      {
        name: 'Nike Air Zoom Pegasus 39 Shield',
        description:
          'Rain, hail, snow, wind—the Nike Air Zoom Pegasus 39 Shield is ready for it all. Its water-repellent finish helps keep you dry while a grippy tread gives you traction on slick surfaces. Sworn enemy of wet and cold, this shoe is a trusty companion.',
        categoryId: categoryData[0].id,
        genderId: womenGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        colors: ['Black', 'Grey', 'Pink'],
        basePrice: '140.00',
      },
      {
        name: 'Nike SB Dunk Low Pro',
        description:
          'Created for the hardwood but taken to the streets, the Nike Dunk Low Pro SB returns with classic details and throwback hoops flair. Its low-cut, padded collar lets you take your game anywhere—in comfort.',
        categoryId: categoryData[3].id,
        genderId: unisexGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        colors: ['Blue', 'Red', 'Black'],
        basePrice: '110.00',
      },
      {
        name: 'Nike Kyrie Infinity',
        description:
          'Specifically tuned for 2-way players who want to go all-out on both ends of the floor, the Kyrie Infinity bridges the best of the past with the latest innovations. It has an updated traction pattern and a revamped cushioning system.',
        categoryId: categoryData[1].id,
        genderId: menGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        colors: ['Black', 'White', 'Purple'],
        basePrice: '130.00',
      },
      {
        name: 'Nike Free Run 5.0',
        description:
          'The Nike Free Run 5.0 is designed to give you a barefoot-like feel with the protection and traction you need. Flexible grooves in the sole expand and contract with every step, while the soft, stretchy upper moves with your foot.',
        categoryId: categoryData[0].id,
        genderId: womenGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        colors: ['Pink', 'White', 'Grey'],
        basePrice: '120.00',
      },
    ];

    for (const productData of productsData) {
      console.log(`  Creating product: ${productData.name}`);

      const [product] = await db
        .insert(products)
        .values({
          name: productData.name,
          description: productData.description,
          categoryId: productData.categoryId,
          genderId: productData.genderId,
          brandId: productData.brandId,
          isPublished: productData.isPublished,
        })
        .returning();

      const selectedColors = productData.colors
        .map((colorName) => colorData.find((c) => c.name === colorName))
        .filter((c) => c !== undefined);

      const selectedSizes = sizeData.slice(0, Math.floor(Math.random() * 5) + 6);

      const variants = [];
      for (const color of selectedColors) {
        for (const size of selectedSizes) {
          const hasDiscount = Math.random() > 0.7;
          const salePrice = hasDiscount
            ? (parseFloat(productData.basePrice) * 0.8).toFixed(2)
            : null;

          const [variant] = await db
            .insert(productVariants)
            .values({
              productId: product.id,
              sku: `${product.name.replace(/\s+/g, '-').toUpperCase()}-${color!.slug.toUpperCase()}-${size.slug.toUpperCase()}`,
              price: productData.basePrice,
              salePrice,
              colorId: color!.id,
              sizeId: size.id,
              inStock: Math.floor(Math.random() * 50) + 10,
              weight: 0.5 + Math.random() * 0.5,
              dimensions: {
                length: 30 + Math.random() * 5,
                width: 15 + Math.random() * 3,
                height: 12 + Math.random() * 3,
              },
            })
            .returning();

          variants.push(variant);
        }
      }

      if (variants.length > 0) {
        await db
          .update(products)
          .set({ defaultVariantId: variants[0].id })
          .where({ id: product.id });
      }

      const imageUrls = [
        `https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/${Math.random().toString(36).substring(7)}.jpg`,
        `https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/${Math.random().toString(36).substring(7)}.jpg`,
        `https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/${Math.random().toString(36).substring(7)}.jpg`,
      ];

      for (let i = 0; i < imageUrls.length; i++) {
        await db.insert(productImages).values({
          productId: product.id,
          variantId: i === 0 ? variants[0]?.id : null,
          url: imageUrls[i],
          sortOrder: i,
          isPrimary: i === 0,
        });
      }

      const shouldAddToCollection = Math.random() > 0.5;
      if (shouldAddToCollection) {
        const randomCollection =
          collectionData[Math.floor(Math.random() * collectionData.length)];
        await db.insert(productCollections).values({
          productId: product.id,
          collectionId: randomCollection.id,
        });
      }
    }

    console.log('✅ Database seeded successfully!');
    console.log(`   - ${productsData.length} products created`);
    console.log(`   - Multiple variants per product with different colors and sizes`);
    console.log(`   - Product images and collections assigned`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log('🎉 Seed completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seed failed:', error);
    process.exit(1);
  });
