'use client'

import { useMemo, useState } from 'react'
import type { ProductFull } from '@/entities/product'
import {
  getEffectiveStampSize,
  getFilteredStampSizes,
  getOrderedSizes,
  STAMP_SIDES,
  type StampSide,
} from '../lib/product-purchase'

export function useProductPurchase(product: ProductFull) {
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedStampSide, setSelectedStampSide] = useState<StampSide>(STAMP_SIDES[1])
  const [selectedStampSize, setSelectedStampSize] = useState<string | null>(null)
  const [selectedStampLocations, setSelectedStampLocations] = useState<string[]>([])
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  const orderedSizes = useMemo(() => getOrderedSizes(product), [product])
  const filteredStampSizes = useMemo(
    () => getFilteredStampSizes(product, selectedStampSide),
    [product, selectedStampSide],
  )
  const effectiveSelectedStampSize = useMemo(
    () => getEffectiveStampSize(selectedStampSize, filteredStampSizes),
    [selectedStampSize, filteredStampSizes],
  )
  const isPurchasable = product.active && product.stock > 0

  return {
    quantity,
    selectedColor,
    selectedSize,
    selectedStampSide,
    selectedStampLocations,
    orderedSizes,
    filteredStampSizes,
    effectiveSelectedStampSize,
    isPurchasable,
    sizeGuideOpen,
    setQuantity,
    setSelectedColor,
    setSelectedSize,
    setSelectedStampSide,
    setSelectedStampSize,
    setSelectedStampLocations,
    setSizeGuideOpen,
  }
}
