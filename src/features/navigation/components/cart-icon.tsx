'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart, useCartStore } from '@/features/cart'
import { useSyncExternalStore } from 'react'

export function CartIcon() {
  const { totalItems } = useCart()
  const hydrated = useSyncExternalStore(
    (callback) => useCartStore.persist.onFinishHydration(() => callback()),
    () => useCartStore.persist.hasHydrated(),
    () => false,
  )
  const count = hydrated ? totalItems : 0

  return (
    <Link
      href="/carrito"
      data-cart-icon-target="true"
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-transparent text-foreground transition-colors hover:border-border hover:bg-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`Carrito (${count} productos)`}
    >
      <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  )
}
