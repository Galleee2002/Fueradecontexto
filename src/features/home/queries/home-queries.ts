import { sql } from '@/lib/db/client'
import type { ProductCard } from '@/features/products/types'

export async function fetchFeaturedProducts(): Promise<ProductCard[]> {
  const rows = await sql`
    SELECT id, slug, name, price::float, "imageUrl", category
    FROM "Product"
    WHERE active = true AND "deletedAt" IS NULL
    ORDER BY "createdAt" DESC
    LIMIT 8
  `
  return rows as ProductCard[]
}
