import type { ProductInput } from '@/features/products/schemas/product-schema'

type QualityTarget = Pick<
  ProductInput,
  | 'name'
  | 'description'
  | 'price'
  | 'stock'
  | 'shippingWeightGrams'
  | 'shippingHeightCm'
  | 'shippingWidthCm'
  | 'shippingLengthCm'
  | 'images'
  | 'category'
  | 'active'
>

type QualityImage = {
  url: string
  colorName?: string | null | undefined
}

type NullableQualityTarget = Omit<QualityTarget, 'images' | 'shippingWeightGrams' | 'shippingHeightCm' | 'shippingWidthCm' | 'shippingLengthCm'> & {
  images: QualityImage[]
  shippingWeightGrams: number | null
  shippingHeightCm: number | null
  shippingWidthCm: number | null
  shippingLengthCm: number | null
}

export type ProductQualityStatus = 'ready' | 'attention' | 'incomplete'

export interface ProductQualityReport {
  status: ProductQualityStatus
  blockers: string[]
  warnings: string[]
}

export function evaluateProductQuality(product: NullableQualityTarget): ProductQualityReport {
  const blockers: string[] = []
  const warnings: string[] = []
  const description = product.description?.trim() ?? ''
  const validImages = product.images.filter((image) => image.url.trim().length > 0)

  if (product.name.trim().length < 4) {
    blockers.push('El nombre debe describir el producto con claridad.')
  }

  if (description.length < 32) {
    blockers.push('Sumá una descripción comercial de al menos 32 caracteres.')
  }

  if (validImages.length === 0) {
    blockers.push('Subí al menos una imagen válida del producto.')
  }

  if (!product.category.trim()) {
    blockers.push('Seleccioná una categoría.')
  }

  if (product.price <= 0) {
    blockers.push('Definí un precio mayor a 0.')
  }

  if (!product.shippingWeightGrams || !product.shippingHeightCm || !product.shippingWidthCm || !product.shippingLengthCm) {
    blockers.push('Completá los datos logísticos para el cálculo de envío.')
  }

  if (validImages.length === 1) {
    warnings.push('Solo hay una imagen; la ficha se verá más sólida con una galería más completa.')
  }

  if (product.stock <= 0) {
    warnings.push('El producto quedará visible pero figurará sin stock.')
  }

  return {
    status: blockers.length > 0 ? 'incomplete' : warnings.length > 0 ? 'attention' : 'ready',
    blockers,
    warnings,
  }
}
