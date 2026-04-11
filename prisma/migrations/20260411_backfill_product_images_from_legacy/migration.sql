ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "images" JSONB NOT NULL DEFAULT '[]'::jsonb;

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
  );
