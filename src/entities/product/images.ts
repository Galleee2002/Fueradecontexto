import type { ProductImage } from './index'

interface LegacyProductImageSource {
  imageUrl?: unknown
  previewImages?: unknown
  images?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeColorName(value: unknown) {
  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function normalizeImageEntry(value: unknown): ProductImage | null {
  if (!isRecord(value)) return null

  const url = typeof value.url === 'string' ? value.url.trim() : ''
  if (!url) return null

  return {
    url,
    colorName: normalizeColorName(value.colorName) ?? null,
  }
}

export function normalizeProductImages(source: LegacyProductImageSource): ProductImage[] {
  const normalizedImages = Array.isArray(source.images)
    ? source.images
        .map(normalizeImageEntry)
        .filter((image): image is ProductImage => image !== null)
    : []

  if (normalizedImages.length > 0) {
    const unique = new Map<string, ProductImage>()

    for (const image of normalizedImages) {
      const key = `${image.url}::${image.colorName ?? ''}`
      if (!unique.has(key)) unique.set(key, image)
    }

    return Array.from(unique.values())
  }

  const legacyUrls = [
    typeof source.imageUrl === 'string' ? source.imageUrl.trim() : '',
    ...(Array.isArray(source.previewImages)
      ? source.previewImages
          .map((value) => (typeof value === 'string' ? value.trim() : ''))
          .filter(Boolean)
      : []),
  ].filter(Boolean)

  return legacyUrls.filter((url, index, array) => array.indexOf(url) === index).map((url) => ({ url }))
}

export function getPrimaryProductImage(images: ProductImage[], fallback = '') {
  return images[0]?.url ?? fallback
}

export function getLegacyPreviewImages(images: ProductImage[]) {
  return images.slice(1).map((image) => image.url)
}
