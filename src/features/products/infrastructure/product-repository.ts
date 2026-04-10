import { sql } from '@/shared/infrastructure/db/client'
import { MAX_PRODUCTS_PER_PAGE } from '@/shared/config/site'
import type { ProductCard, ProductFull, ProductFilters, SizeGuide } from '../types'

export async function findProducts(
  filters?: ProductFilters,
  page = 1,
  limit = MAX_PRODUCTS_PER_PAGE
): Promise<{ products: ProductCard[]; total: number; totalPages: number }> {
  const offset = (page - 1) * limit

  const orderBy =
    filters?.sort === 'price-asc'
      ? sql`ORDER BY price ASC`
      : filters?.sort === 'price-desc'
        ? sql`ORDER BY price DESC`
        : sql`ORDER BY "createdAt" DESC`

  const rows = await sql`
    SELECT p.id, p.slug, p.name, p.price::float, p.stock, p."imageUrl",
           COALESCE(to_jsonb(p) -> 'previewImages', to_jsonb(p) -> 'preview_images', '[]'::jsonb) AS "previewImages",
           p.category
    FROM "Product" p
    WHERE p.active = true AND p."deletedAt" IS NULL
    ${filters?.category ? sql`AND category = ${filters.category}` : sql``}
    ${filters?.search ? sql`AND name ILIKE ${'%' + filters.search + '%'}` : sql``}
    ${filters?.minPrice !== undefined ? sql`AND price >= ${filters.minPrice}` : sql``}
    ${filters?.maxPrice !== undefined ? sql`AND price <= ${filters.maxPrice}` : sql``}
    ${orderBy}
    LIMIT ${limit} OFFSET ${offset}
  `

  const countRows = await sql`
    SELECT COUNT(*)::int AS total
    FROM "Product"
    WHERE active = true AND "deletedAt" IS NULL
    ${filters?.category ? sql`AND category = ${filters.category}` : sql``}
    ${filters?.search ? sql`AND name ILIKE ${'%' + filters.search + '%'}` : sql``}
    ${filters?.minPrice !== undefined ? sql`AND price >= ${filters.minPrice}` : sql``}
    ${filters?.maxPrice !== undefined ? sql`AND price <= ${filters.maxPrice}` : sql``}
  `

  const total = (countRows[0] as { total: number }).total
  const totalPages = Math.ceil(total / limit)

  return { products: rows as ProductCard[], total, totalPages }
}

export async function findProductBySlug(slug: string): Promise<ProductFull | null> {
  const rows = await sql`
    SELECT p.id, p.slug, p.name, p.description, p.price::float, p.stock, p."imageUrl",
           COALESCE(to_jsonb(p) -> 'previewImages', to_jsonb(p) -> 'preview_images', '[]'::jsonb) AS "previewImages",
           p.category, p.active, p."createdAt", p."updatedAt", p."deletedAt",
           p."availableColors", p."availableSizes", p."stampSizes", p."stampLocations"
    FROM "Product" p
    WHERE p.slug = ${slug} AND p.active = true AND p."deletedAt" IS NULL
    LIMIT 1
  `
  return (rows[0] as ProductFull) ?? null
}

export async function findSizeGuideByCategory(category: string): Promise<SizeGuide | null> {
  const rows = await sql`
    SELECT id, category, rows, "createdAt", "updatedAt"
    FROM "SizeGuide"
    WHERE category = ${category}
    LIMIT 1
  `
  return (rows[0] as SizeGuide) ?? null
}

export async function findSizeGuides(): Promise<SizeGuide[]> {
  const rows = await sql`
    SELECT id, category, rows, "createdAt", "updatedAt"
    FROM "SizeGuide"
    ORDER BY category
  `
  return rows as SizeGuide[]
}

export async function findProductCategories(): Promise<string[]> {
  const rows = await sql`
    SELECT c.name
    FROM "Category" c
    WHERE EXISTS (
      SELECT 1 FROM "Product" p WHERE p.category = c.name AND p.active = true AND p."deletedAt" IS NULL
    )
    ORDER BY c.name
  `
  return rows.map((r) => (r as { name: string }).name)
}

export async function findRelatedProducts(
  category: string,
  excludeSlug: string,
  limit = 4
): Promise<ProductCard[]> {
  const rows = await sql`
    SELECT p.id, p.slug, p.name, p.price::float, p.stock, p."imageUrl",
           COALESCE(to_jsonb(p) -> 'previewImages', to_jsonb(p) -> 'preview_images', '[]'::jsonb) AS "previewImages",
           p.category
    FROM "Product" p
    WHERE p.active = true
      AND p.category = ${category}
      AND p.slug != ${excludeSlug}
      AND p."deletedAt" IS NULL
    ORDER BY p."createdAt" DESC
    LIMIT ${limit}
  `
  return rows as ProductCard[]
}
