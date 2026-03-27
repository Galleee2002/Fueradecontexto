'use client'

import Image from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format-price'
import { useCart } from '../hooks/use-cart'
import type { CartItemUI } from '../types'

interface CartItemProps {
  item: CartItemUI
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCart()

  return (
    <div className="flex gap-4 py-4 border-b border-border">
      <div className="relative w-20 aspect-[3/4] shrink-0 bg-surface overflow-hidden">
        <Image
          src={item.productImageUrl}
          alt={item.productName}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <h4 className="text-sm font-medium leading-snug">{item.productName}</h4>
          <button
            onClick={() => removeItem(item.id)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Eliminar producto"
          >
            <X className="h-4 w-4 stroke-[1.5]" />
          </button>
        </div>

        <p className="text-sm font-semibold">{formatPrice(item.productPrice)}</p>

        {(item.selectedColor || item.selectedSize || item.selectedStampSize || item.selectedStampLocation) && (
          <p className="text-xs text-muted-foreground leading-snug">
            {[
              item.selectedColor && `Color: ${item.selectedColor}`,
              item.selectedSize && `Talle: ${item.selectedSize}`,
              item.selectedStampSize && `Estampa: ${item.selectedStampSize}`,
              item.selectedStampLocation && item.selectedStampLocation,
            ].filter(Boolean).join(' · ')}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="h-11 w-11 sm:h-7 sm:w-7 border border-border flex items-center justify-center hover:bg-surface transition-colors touch-manipulation"
            aria-label="Disminuir cantidad"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="text-sm w-4 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="h-11 w-11 sm:h-7 sm:w-7 border border-border flex items-center justify-center hover:bg-surface transition-colors touch-manipulation"
            aria-label="Aumentar cantidad"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
