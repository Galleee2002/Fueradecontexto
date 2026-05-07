import type { ProductFull } from '@/entities/product'
import { GARMENT_SIZES_ORDERED } from '@/shared/config/garment-sizes'

export const STAMP_SIDES = ['FRENTE', 'DORSO'] as const
export type StampSide = (typeof STAMP_SIDES)[number]
const STAMP_SIZE_ORDER = ['Hasta 10 cm', '20x30', '30x40', '40x50'] as const

export function getOrderedSizes(product: ProductFull) {
  return GARMENT_SIZES_ORDERED.filter((size) => product.availableSizes.includes(size))
}

export function getFilteredStampSizes(product: ProductFull, stampSide: StampSide | null) {
  if (!stampSide) {
    return []
  }

  const orderedStampSizes = STAMP_SIZE_ORDER.filter((size) => product.stampSizes.includes(size))

  return stampSide === 'FRENTE'
    ? orderedStampSizes.filter((size) => size !== '40x50')
    : orderedStampSizes
}

export function getEffectiveStampSize(selectedStampSize: string | null, availableStampSizes: string[]) {
  if (!selectedStampSize) {
    return null
  }

  return availableStampSizes.includes(selectedStampSize) ? selectedStampSize : null
}
