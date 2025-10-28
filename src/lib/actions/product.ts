'use server';

import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import {
  genders,
  brands,
  categories,
  colors,
  sizes,
} from '@/lib/db/schema';
import { inArray } from 'drizzle-orm';

export interface GetAllProductsParams {
  search?: string;
  genderSlugs?: string[];
  brandSlugs?: string[];
  categorySlugs?: string[];
  colorSlugs?: string[];
  sizeSlugs?: string[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'latest' | 'featured';
  page?: number;
  limit?: number;
}

export interface ProductListItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  brand: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  minPrice: string;
  maxPrice: string;
}

export interface GetAllProductsResult {
  products: ProductListItem[];
  totalCount: number;
}

export interface ProductDetail {
  id: string;
  name: string;
  description: string;
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
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  variants: Array<{
    id: string;
    sku: string;
    price: string;
    salePrice: string | null;
    inStock: number;
    color: {
      id: string;
      name: string;
      slug: string;
      hexCode: string;
    };
    size: {
      id: string;
      name: string;
      slug: string;
    };
    images: string[];
  }>;
  genericImages: string[];
}

async function mapSlugsToIds(
  genderSlugs?: string[],
  brandSlugs?: string[],
  categorySlugs?: string[],
  colorSlugs?: string[],
  sizeSlugs?: string[]
) {
  const [genderIds, brandIds, categoryIds, colorIds, sizeIds] = await Promise.all([
    genderSlugs && genderSlugs.length > 0
      ? db.select({ id: genders.id }).from(genders).where(inArray(genders.slug, genderSlugs))
      : Promise.resolve([]),
    brandSlugs && brandSlugs.length > 0
      ? db.select({ id: brands.id }).from(brands).where(inArray(brands.slug, brandSlugs))
      : Promise.resolve([]),
    categorySlugs && categorySlugs.length > 0
      ? db.select({ id: categories.id }).from(categories).where(inArray(categories.slug, categorySlugs))
      : Promise.resolve([]),
    colorSlugs && colorSlugs.length > 0
      ? db.select({ id: colors.id }).from(colors).where(inArray(colors.slug, colorSlugs))
      : Promise.resolve([]),
    sizeSlugs && sizeSlugs.length > 0
      ? db.select({ id: sizes.id }).from(sizes).where(inArray(sizes.slug, sizeSlugs))
      : Promise.resolve([]),
  ]);

  return {
    genderIds: genderIds.map((g) => g.id),
    brandIds: brandIds.map((b) => b.id),
    categoryIds: categoryIds.map((c) => c.id),
    colorIds: colorIds.map((c) => c.id),
    sizeIds: sizeIds.map((s) => s.id),
  };
}

export async function getAllProducts(
  params: GetAllProductsParams = {}
): Promise<GetAllProductsResult> {
  const {
    search,
    genderSlugs,
    brandSlugs,
    categorySlugs,
    colorSlugs,
    sizeSlugs,
    priceMin,
    priceMax,
    sortBy = 'latest',
    page = 1,
    limit = 24,
  } = params;

  const offset = (page - 1) * limit;

  const { genderIds, brandIds, categoryIds, colorIds, sizeIds } = await mapSlugsToIds(
    genderSlugs,
    brandSlugs,
    categorySlugs,
    colorSlugs,
    sizeSlugs
  );

  const variantFilters: string[] = [];
  const variantParams: (string[] | number | string)[] = [];
  let paramIndex = 1;

  if (colorIds.length > 0) {
    variantFilters.push(`pv.color_id = ANY($${paramIndex})`);
    variantParams.push(colorIds);
    paramIndex++;
  }

  if (sizeIds.length > 0) {
    variantFilters.push(`pv.size_id = ANY($${paramIndex})`);
    variantParams.push(sizeIds);
    paramIndex++;
  }

  if (priceMin !== undefined) {
    variantFilters.push(`COALESCE(pv.sale_price::numeric, pv.price::numeric) >= $${paramIndex}`);
    variantParams.push(priceMin);
    paramIndex++;
  }

  if (priceMax !== undefined) {
    variantFilters.push(`COALESCE(pv.sale_price::numeric, pv.price::numeric) <= $${paramIndex}`);
    variantParams.push(priceMax);
    paramIndex++;
  }

  const variantWhereClause = variantFilters.length > 0 ? `WHERE ${variantFilters.join(' AND ')}` : '';

  const productFilters: string[] = ['p.is_published = true'];
  
  if (genderIds.length > 0) {
    productFilters.push(`p.gender_id = ANY($${paramIndex})`);
    variantParams.push(genderIds);
    paramIndex++;
  }

  if (brandIds.length > 0) {
    productFilters.push(`p.brand_id = ANY($${paramIndex})`);
    variantParams.push(brandIds);
    paramIndex++;
  }

  if (categoryIds.length > 0) {
    productFilters.push(`p.category_id = ANY($${paramIndex})`);
    variantParams.push(categoryIds);
    paramIndex++;
  }

  if (search) {
    productFilters.push(`p.name ILIKE $${paramIndex}`);
    variantParams.push(`%${search}%`);
    paramIndex++;
  }

  const productWhereClause = productFilters.join(' AND ');

  let orderByClause = '';
  switch (sortBy) {
    case 'price_asc':
      orderByClause = 'v_agg.min_price ASC';
      break;
    case 'price_desc':
      orderByClause = 'v_agg.min_price DESC';
      break;
    case 'featured':
      orderByClause = '(pc.collection_id IS NOT NULL) DESC, p.created_at DESC';
      break;
    case 'latest':
    default:
      orderByClause = 'p.created_at DESC';
      break;
  }

  variantParams.push(limit);
  const limitParamIndex = paramIndex;
  paramIndex++;
  
  variantParams.push(offset);
  const offsetParamIndex = paramIndex;

  const query = `
    WITH v_agg AS (
      SELECT 
        pv.product_id,
        MIN(COALESCE(pv.sale_price::numeric, pv.price::numeric)) AS min_price,
        MAX(COALESCE(pv.sale_price::numeric, pv.price::numeric)) AS max_price,
        MAX(pv.in_stock) AS max_stock
      FROM product_variants pv
      ${variantWhereClause}
      GROUP BY pv.product_id
    ),
    p_base AS (
      SELECT 
        p.*,
        v_agg.min_price,
        v_agg.max_price,
        v_agg.max_stock,
        c.name AS category_name,
        b.name AS brand_name,
        ${sortBy === 'featured' ? 'pc.collection_id' : 'NULL AS collection_id'}
      FROM products p
      INNER JOIN v_agg ON v_agg.product_id = p.id
      INNER JOIN categories c ON c.id = p.category_id
      INNER JOIN brands b ON b.id = p.brand_id
      ${sortBy === 'featured' ? `
        LEFT JOIN product_collections pc ON pc.product_id = p.id
        LEFT JOIN collections col ON col.id = pc.collection_id AND col.slug = 'featured'
      ` : ''}
      WHERE ${productWhereClause}
    ),
    p_ranked AS (
      SELECT 
        *,
        COUNT(*) OVER () AS total_count
      FROM p_base
      ORDER BY ${orderByClause}
      LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}
    )
    SELECT 
      p_ranked.*,
      COALESCE(
        (
          SELECT json_agg(pi.url ORDER BY pi.is_primary DESC, pi.sort_order ASC)
          FROM product_images pi
          ${colorIds.length > 0 ? `
            INNER JOIN product_variants pv ON pv.id = pi.variant_id
            WHERE pi.product_id = p_ranked.id AND pv.color_id = ANY($1)
          ` : 'WHERE 1=0'}
        ),
        (
          SELECT json_agg(pi.url ORDER BY pi.is_primary DESC, pi.sort_order ASC)
          FROM product_images pi
          WHERE pi.product_id = p_ranked.id AND pi.variant_id IS NULL
        )
      ) AS images
    FROM p_ranked
  `;

  interface ProductRow {
    id: string;
    name: string;
    description: string;
    min_price: string;
    max_price: string;
    max_stock: number;
    category_name: string;
    brand_name: string;
    created_at: string;
    updated_at: string;
    total_count: number;
    images: string[] | null;
  }

  const result = await db.execute(sql.raw(query, variantParams));
  
  const rows = result.rows as ProductRow[];
  
  if (rows.length === 0) {
    return {
      products: [],
      totalCount: 0,
    };
  }

  const totalCount = rows[0]?.total_count ? Number(rows[0].total_count) : 0;

  const products: ProductListItem[] = rows.map((row) => {
    const images = row.images || [];
    const primaryImage = images[0] || '/placeholder.png';

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.min_price).toFixed(2),
      image: primaryImage,
      category: row.category_name,
      brand: row.brand_name,
      stock: Number(row.max_stock),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      minPrice: Number(row.min_price).toFixed(2),
      maxPrice: Number(row.max_price).toFixed(2),
    };
  });

  return {
    products,
    totalCount,
  };
}

export async function getProduct(productId: string): Promise<ProductDetail | null> {
  const query = `
    WITH product_data AS (
      SELECT 
        p.*,
        c.id AS category_id,
        c.name AS category_name,
        c.slug AS category_slug,
        g.id AS gender_id,
        g.label AS gender_label,
        g.slug AS gender_slug,
        b.id AS brand_id,
        b.name AS brand_name,
        b.slug AS brand_slug
      FROM products p
      INNER JOIN categories c ON c.id = p.category_id
      INNER JOIN genders g ON g.id = p.gender_id
      INNER JOIN brands b ON b.id = p.brand_id
      WHERE p.id = $1
    ),
    variant_data AS (
      SELECT 
        pv.*,
        col.id AS color_id,
        col.name AS color_name,
        col.slug AS color_slug,
        col.hex_code AS color_hex,
        s.id AS size_id,
        s.name AS size_name,
        s.slug AS size_slug,
        (
          SELECT json_agg(pi.url ORDER BY pi.is_primary DESC, pi.sort_order ASC)
          FROM product_images pi
          WHERE pi.variant_id = pv.id
        ) AS variant_images
      FROM product_variants pv
      INNER JOIN colors col ON col.id = pv.color_id
      INNER JOIN sizes s ON s.id = pv.size_id
      WHERE pv.product_id = $1
    ),
    generic_images AS (
      SELECT json_agg(pi.url ORDER BY pi.is_primary DESC, pi.sort_order ASC) AS images
      FROM product_images pi
      WHERE pi.product_id = $1 AND pi.variant_id IS NULL
    )
    SELECT 
      pd.*,
      (SELECT json_agg(vd.*) FROM variant_data vd) AS variants,
      gi.images AS generic_images
    FROM product_data pd
    CROSS JOIN generic_images gi
  `;

  interface VariantRow {
    id: string;
    sku: string;
    price: string;
    sale_price: string | null;
    in_stock: number;
    color_id: string;
    color_name: string;
    color_slug: string;
    color_hex: string;
    size_id: string;
    size_name: string;
    size_slug: string;
    variant_images: string[] | null;
  }

  interface ProductDetailRow {
    id: string;
    name: string;
    description: string;
    category_id: string;
    category_name: string;
    category_slug: string;
    gender_id: string;
    gender_label: string;
    gender_slug: string;
    brand_id: string;
    brand_name: string;
    brand_slug: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    variants: VariantRow[] | null;
    generic_images: string[] | null;
  }

  const result = await db.execute(sql.raw(query, [productId]));
  const rows = result.rows as ProductDetailRow[];

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  const variantsData = row.variants || [];

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: {
      id: row.category_id,
      name: row.category_name,
      slug: row.category_slug,
    },
    gender: {
      id: row.gender_id,
      label: row.gender_label,
      slug: row.gender_slug,
    },
    brand: {
      id: row.brand_id,
      name: row.brand_name,
      slug: row.brand_slug,
    },
    isPublished: row.is_published,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    variants: variantsData.map((v) => ({
      id: v.id,
      sku: v.sku,
      price: Number(v.price).toFixed(2),
      salePrice: v.sale_price ? Number(v.sale_price).toFixed(2) : null,
      inStock: v.in_stock,
      color: {
        id: v.color_id,
        name: v.color_name,
        slug: v.color_slug,
        hexCode: v.color_hex,
      },
      size: {
        id: v.size_id,
        name: v.size_name,
        slug: v.size_slug,
      },
      images: v.variant_images || [],
    })),
    genericImages: row.generic_images || [],
  };
}
