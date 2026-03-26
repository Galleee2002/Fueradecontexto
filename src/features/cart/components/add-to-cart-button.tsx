'use client'

import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../hooks/use-cart'

interface AddToCartButtonProps {
  productId: string
  productName: string
  productPrice?: number
  productImageUrl?: string
  productSlug?: string
  quantity?: number
  selectedColor?: string
  selectedSize?: string
  selectedStampSize?: string
  selectedStampLocation?: string
}

export function AddToCartButton({
  productId,
  productName,
  productPrice = 0,
  productImageUrl = '',
  productSlug = '',
  quantity = 1,
  selectedColor,
  selectedSize,
  selectedStampSize,
  selectedStampLocation,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const { addItem, openCart } = useCart()

  async function handleAddToCart() {
    setLoading(true)
    addItem({
      productId,
      productName,
      productPrice,
      productImageUrl,
      productSlug,
      quantity,
      ...(selectedColor !== undefined ? { selectedColor } : {}),
      ...(selectedSize !== undefined ? { selectedSize } : {}),
      ...(selectedStampSize !== undefined ? { selectedStampSize } : {}),
      ...(selectedStampLocation !== undefined ? { selectedStampLocation } : {}),
    })
    openCart()
    setLoading(false)
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="flex items-center gap-3 bg-primary text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-50 rounded-none px-8 py-4 text-sm font-medium tracking-widest uppercase transition-colors w-full justify-center"
    >
      <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
      {loading ? 'Agregando...' : 'Agregar al carrito'}
    </button>
  )
}
