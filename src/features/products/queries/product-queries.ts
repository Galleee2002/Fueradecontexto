import { sql } from '@/lib/db/client'
import { MAX_PRODUCTS_PER_PAGE } from '@/lib/constants/site'
import type { ProductCard, ProductFull, ProductFilters } from '../types'

export async function fetchProducts(
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
    SELECT id, slug, name, price::float, "imageUrl", category
    FROM "Product"
    WHERE active = true
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
    WHERE active = true
    ${filters?.category ? sql`AND category = ${filters.category}` : sql``}
    ${filters?.search ? sql`AND name ILIKE ${'%' + filters.search + '%'}` : sql``}
    ${filters?.minPrice !== undefined ? sql`AND price >= ${filters.minPrice}` : sql``}
    ${filters?.maxPrice !== undefined ? sql`AND price <= ${filters.maxPrice}` : sql``}
  `

  const total = (countRows[0] as { total: number }).total
  const totalPages = Math.ceil(total / limit)

  return { products: rows as ProductCard[], total, totalPages }
}

export async function fetchProductBySlug(slug: string): Promise<ProductFull | null> {
  const rows = await sql`
    SELECT id, slug, name, description, price::float, "imageUrl", category, active, "createdAt", "updatedAt"
    FROM "Product"
    WHERE slug = ${slug} AND active = true
    LIMIT 1
  `
  return (rows[0] as ProductFull) ?? null
}

export async function fetchProductCategories(): Promise<string[]> {
  const rows = await sql`
    SELECT DISTINCT category FROM "Product" WHERE active = true ORDER BY category
  `
  return rows.map((r) => (r as { category: string }).category)
}

export async function fetchRelatedProducts(
  category: string,
  excludeSlug: string,
  limit = 4
): Promise<ProductCard[]> {
  const rows = await sql`
    SELECT id, slug, name, price::float, "imageUrl", category
    FROM "Product"
    WHERE active = true
      AND category = ${category}
      AND slug != ${excludeSlug}
    ORDER BY "createdAt" DESC
    LIMIT ${limit}
  `
  return rows as ProductCard[]
}
