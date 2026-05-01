'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ProductFull } from '@/entities/product'
import {
  getEffectiveStampSize,
  getFilteredStampSizes,
  getOrderedSizes,
  STAMP_SIDES,
  type StampSide,
} from '../lib/product-purchase'
import { isCapCategory } from '../lib/stamp-pricing'

export function useProductPurchase(product: ProductFull) {
  const isCap = isCapCategory(product.category)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedStampSide, setSelectedStampSide] = useState<StampSide | null>(
    isCap ? STAMP_SIDES[0] : STAMP_SIDES[1],
  )
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

  useEffect(() => {
    if (isCap && selectedStampSide && selectedStampSide !== STAMP_SIDES[0]) {
      setSelectedStampSide(STAMP_SIDES[0])
    }
  }, [isCap, selectedStampSide])

  useEffect(() => {
    if (!selectedStampSide) {
      setSelectedStampSize(null)
      if (selectedStampLocations.length > 0) {
        setSelectedStampLocations([])
      }
    }
  }, [selectedStampSide, selectedStampLocations.length])

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
