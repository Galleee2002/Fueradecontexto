'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/features/cart/hooks/use-cart'
import { useEffect, useState } from 'react'

export function CartIcon() {
  const { totalItems } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const count = mounted ? totalItems : 0

  return (
    <Link
      href="/carrito"
      data-cart-icon-target="true"
      className="relative text-foreground hover:text-primary transition-colors"
      aria-label={`Carrito (${count} productos)`}
    >
      <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-medium h-4 w-4 flex items-center justify-center rounded-full">
          {count}
        </span>
      )}
    </Link>
  )
}
