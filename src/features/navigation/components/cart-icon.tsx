'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/features/cart/hooks/use-cart'

export function CartIcon() {
  const { totalItems } = useCart()

  return (
    <Link
      href="/carrito"
      className="relative text-foreground hover:text-primary transition-colors"
      aria-label={`Carrito (${totalItems} productos)`}
    >
      <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-medium h-4 w-4 flex items-center justify-center rounded-full">
          {totalItems}
        </span>
      )}
    </Link>
  )
}
