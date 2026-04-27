'use client'

import Image from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
import { formatPrice } from '@/shared/lib/format-price'
import { useCart } from '../hooks/use-cart'
import type { CartItemUI } from '../types'

interface CartItemProps {
  item: CartItemUI
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCart()

  return (
    <div className="flex gap-4 border-b border-border py-5">
      <div className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-[1rem] border border-border bg-surface">
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
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Eliminar producto"
          >
            <X className="h-4 w-4 stroke-[1.5]" />
          </button>
        </div>

        <p className="text-sm font-semibold">{formatPrice(item.productPrice)}</p>

        {(item.selectedColor || item.selectedSize || item.selectedStampSize || (item.selectedStampLocations && item.selectedStampLocations.length > 0)) && (
          <p className="text-xs text-muted-foreground leading-snug">
            {[
              item.selectedColor && `Color: ${item.selectedColor}`,
              item.selectedSize && `Talle: ${item.selectedSize}`,
              item.selectedStampSize && `Estampa: ${item.selectedStampSize}`,
              item.selectedStampLocations && item.selectedStampLocations.length > 0 && `Ubicación: ${item.selectedStampLocations.join(', ')}`,
            ].filter(Boolean).join(' · ')}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-surface touch-manipulation sm:h-9 sm:w-9"
            aria-label="Disminuir cantidad"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-surface touch-manipulation sm:h-9 sm:w-9"
            aria-label="Aumentar cantidad"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
