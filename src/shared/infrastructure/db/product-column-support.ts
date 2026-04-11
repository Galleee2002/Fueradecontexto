import { sql } from './client'

type ProductColumnSupport = {
  hasImages: boolean
  hasPreviewImages: boolean
}

let productColumnSupportPromise: Promise<ProductColumnSupport> | null = null

async function loadProductColumnSupport(): Promise<ProductColumnSupport> {
  const rows = (await sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Product'
      AND column_name IN ('images', 'previewImages')
  `) as Array<{ column_name: string }>

  const columns = new Set(rows.map((row) => row.column_name))

  return {
    hasImages: columns.has('images'),
    hasPreviewImages: columns.has('previewImages'),
  }
}

async function loadCachedProductColumnSupport() {
  if (productColumnSupportPromise) return productColumnSupportPromise

  productColumnSupportPromise = loadProductColumnSupport().catch((error) => {
    productColumnSupportPromise = null
    throw error
  })

  return productColumnSupportPromise
}

async function refreshProductColumnSupport() {
  productColumnSupportPromise = null
  return loadCachedProductColumnSupport()
}

async function backfillProductImagesFromLegacyData() {
  await sql`
    UPDATE "Product" p
    SET "images" = COALESCE(
      (
        SELECT jsonb_agg(jsonb_build_object('url', source.url) ORDER BY source.ord)
        FROM (
          SELECT 0 AS ord, NULLIF(BTRIM(p."imageUrl"), '') AS url
          UNION ALL
          SELECT legacy.ord::int, NULLIF(BTRIM(legacy.value #>> '{}'), '') AS url
          FROM jsonb_array_elements(COALESCE(p."previewImages", '[]'::jsonb)) WITH ORDINALITY AS legacy(value, ord)
        ) AS source
        WHERE source.url IS NOT NULL
      ),
      '[]'::jsonb
    )
    WHERE jsonb_array_length(COALESCE(p."images", '[]'::jsonb)) = 0
      AND (
        NULLIF(BTRIM(p."imageUrl"), '') IS NOT NULL
        OR jsonb_array_length(COALESCE(p."previewImages", '[]'::jsonb)) > 0
      )
  `
}

export async function getProductColumnSupport(): Promise<ProductColumnSupport> {
  return loadCachedProductColumnSupport()
}

export async function ensureProductColumnSupport(): Promise<ProductColumnSupport> {
  const support = await loadCachedProductColumnSupport()

  if (!support.hasPreviewImages) {
    await sql`
      ALTER TABLE "Product"
      ADD COLUMN IF NOT EXISTS "previewImages" JSONB NOT NULL DEFAULT '[]'::jsonb
    `
  }

  if (!support.hasImages) {
    await sql`
      ALTER TABLE "Product"
      ADD COLUMN IF NOT EXISTS "images" JSONB NOT NULL DEFAULT '[]'::jsonb
    `
  }

  const needsRefresh = !support.hasImages || !support.hasPreviewImages
  const nextSupport = needsRefresh ? await refreshProductColumnSupport() : support

  if (nextSupport.hasImages) {
    await backfillProductImagesFromLegacyData()
  }

  return nextSupport
}
