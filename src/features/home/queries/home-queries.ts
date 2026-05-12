import { sql } from '@/shared/infrastructure/db/client'
import type { ProductCard } from '@/entities/product'
import { getPrimaryProductImage, normalizeProductImages } from '@/entities/product/images'

export async function fetchFeaturedProducts(): Promise<ProductCard[]> {
  const rows = await sql`
    WITH base AS (
      SELECT p.id, p.slug, p.name, p.description, p.price::float, p.stock, p."imageUrl",
             COALESCE(to_jsonb(p) -> 'images', '[]'::jsonb) AS images,
             COALESCE(to_jsonb(p) -> 'previewImages', to_jsonb(p) -> 'preview_images', '[]'::jsonb) AS "previewImages",
             p.category,
             p."createdAt"
      FROM "Product" p
      WHERE p.active = true AND p."deletedAt" IS NULL
    ),
    candidates AS (
      (
        SELECT b.id, b.slug, b.name, b.description, b.price, b.stock, b."imageUrl", b.images, b."previewImages", b.category, 1 AS pri
        FROM base b
        WHERE LOWER(TRIM(b.category)) = 'buzos' OR LOWER(TRIM(b.category)) LIKE 'buzo%'
        ORDER BY (b.stock > 0) DESC, b.stock DESC, b.id
        LIMIT 8
      )
      UNION ALL
      (
        SELECT b.id, b.slug, b.name, b.description, b.price, b.stock, b."imageUrl", b.images, b."previewImages", b.category, 2 AS pri
        FROM base b
        WHERE LOWER(TRIM(b.category)) = 'remeras' OR LOWER(TRIM(b.category)) LIKE 'remera%'
        ORDER BY (b.stock > 0) DESC, b.stock DESC, b.id
        LIMIT 8
      )
      UNION ALL
      (
        SELECT b.id, b.slug, b.name, b.description, b.price, b.stock, b."imageUrl", b.images, b."previewImages", b.category, 3 AS pri
        FROM base b
        WHERE LOWER(TRIM(b.category)) LIKE '%cobertor%'
           OR LOWER(b.name) LIKE '%cobertor%'
           OR LOWER(b.slug) LIKE '%cobertor%'
        ORDER BY (b.stock > 0) DESC, b.stock DESC, b.id
        LIMIT 8
      )
      UNION ALL
      (
        SELECT b.id, b.slug, b.name, b.description, b.price, b.stock, b."imageUrl", b.images, b."previewImages", b.category, 4 AS pri
        FROM base b
        WHERE LOWER(TRIM(b.category)) LIKE '%tote%'
           OR LOWER(b.name) LIKE '%tote%'
           OR LOWER(b.slug) LIKE '%tote%'
        ORDER BY (b.stock > 0) DESC, b.stock DESC, b.id
        LIMIT 8
      )
      UNION ALL
      (
        SELECT b.id, b.slug, b.name, b.description, b.price, b.stock, b."imageUrl", b.images, b."previewImages", b.category, 5 AS pri
        FROM base b
        ORDER BY b."createdAt" DESC
        LIMIT 48
      )
    )
    SELECT c.id, c.slug, c.name, c.description, c.price, c.stock, c."imageUrl", c.images, c."previewImages", c.category
    FROM (
      SELECT DISTINCT ON (x.id) x.id, x.slug, x.name, x.description, x.price, x.stock, x."imageUrl", x.images, x."previewImages", x.category, x.pri
      FROM candidates x
      ORDER BY x.id, x.pri ASC
    ) c
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
