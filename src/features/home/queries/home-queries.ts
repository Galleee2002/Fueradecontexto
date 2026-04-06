import { sql } from '@/lib/db/client'
import type { ProductCard } from '@/features/products/types'

export async function fetchFeaturedProducts(): Promise<ProductCard[]> {
  const rows = await sql`
    SELECT p.id, p.slug, p.name, p.price::float, p."imageUrl",
           COALESCE(to_jsonb(p) -> 'previewImages', to_jsonb(p) -> 'preview_images', '[]'::jsonb) AS "previewImages",
           p.category
    FROM "Product" p
    WHERE p.active = true AND p."deletedAt" IS NULL
    ORDER BY p."createdAt" DESC
    LIMIT 8
  `
  return rows as ProductCard[]
}
