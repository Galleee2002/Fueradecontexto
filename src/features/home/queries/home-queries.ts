import { sql } from '@/shared/infrastructure/db/client'
import type { ProductCard } from '@/entities/product'

export async function fetchFeaturedProducts(): Promise<ProductCard[]> {
  const rows = await sql`
    SELECT p.id, p.slug, p.name, p.price::float, p.stock, p."imageUrl",
           COALESCE(to_jsonb(p) -> 'previewImages', to_jsonb(p) -> 'preview_images', '[]'::jsonb) AS "previewImages",
           p.category
    FROM "Product" p
    WHERE p.active = true AND p."deletedAt" IS NULL
    ORDER BY p."createdAt" DESC
    LIMIT 24
  `
  return rows as ProductCard[]
}
