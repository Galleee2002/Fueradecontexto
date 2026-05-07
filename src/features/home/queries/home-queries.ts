import { sql } from '@/shared/infrastructure/db/client'
import type { ProductCard } from '@/entities/product'
import { getPrimaryProductImage, normalizeProductImages } from '@/entities/product/images'

export async function fetchFeaturedProducts(): Promise<ProductCard[]> {
  const rows = await sql`
    SELECT p.id, p.slug, p.name, p.description, p.price::float, p.stock, p."imageUrl",
           COALESCE(to_jsonb(p) -> 'images', '[]'::jsonb) AS images,
           COALESCE(to_jsonb(p) -> 'previewImages', to_jsonb(p) -> 'preview_images', '[]'::jsonb) AS "previewImages",
           p.category
    FROM "Product" p
    WHERE p.active = true AND p."deletedAt" IS NULL
    ORDER BY p."createdAt" DESC
    LIMIT 24
  `
  return rows.map((row) => {
    const images = normalizeProductImages(row)

    return {
      ...row,
      imageUrl: getPrimaryProductImage(images, typeof row.imageUrl === 'string' ? row.imageUrl : ''),
      images,
    }
  }) as ProductCard[]
}
