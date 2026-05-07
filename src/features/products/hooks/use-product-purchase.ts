'use client'

import { useCallback, useMemo, useState } from 'react'
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
  const stampSideForStampOptions = isCap ? STAMP_SIDES[0] : selectedStampSide

  const filteredStampSizes = useMemo(
    () => getFilteredStampSizes(product, stampSideForStampOptions),
    [product, stampSideForStampOptions],
  )
  const effectiveSelectedStampSize = useMemo(
    () => getEffectiveStampSize(selectedStampSize, filteredStampSizes),
    [selectedStampSize, filteredStampSizes],
  )
  const isPurchasable = product.active && product.stock > 0

  const setStampSide = useCallback((side: StampSide | null) => {
    setSelectedStampSide(side)
    if (side === null) {
      setSelectedStampSize(null)
      setSelectedStampLocations([])
    }
  }, [])

  return {
    quantity,
    selectedColor,
    selectedSize,
    selectedStampSide: stampSideForStampOptions,
    selectedStampLocations,
    orderedSizes,
    filteredStampSizes,
    effectiveSelectedStampSize,
    isPurchasable,
    sizeGuideOpen,
    setQuantity,
    setSelectedColor,
    setSelectedSize,
    setSelectedStampSide: setStampSide,
    setSelectedStampSize,
    setSelectedStampLocations,
    setSizeGuideOpen,
  }
}
