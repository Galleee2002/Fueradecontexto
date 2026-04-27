'use client'

import Link from 'next/link'
import { useCart } from '../hooks/use-cart'
import { CartItem } from './cart-item'
import { EmptyState } from '@/shared/ui/feedback/empty-state'

export function CartDrawer() {
  const { items, isEmpty, formattedTotal } = useCart()

  if (isEmpty) {
    return (
      <div className="pb-16 sm:pb-20">
        <EmptyState
          title="Tu carrito está vacío"
          description="Explorá nuestra colección y encontrá algo que te guste."
          action={
            <Link
              href="/productos"
              className="brand-button-secondary"
            >
              Ver colección
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="brand-panel-solid py-8 px-5 sm:px-8">
      <div className="space-y-0">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-6 space-y-4 border-t border-border pt-8">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">{formattedTotal}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          El envío se calcula en el checkout.
        </p>
        <Link
          href="/checkout"
          className="brand-button-primary w-full"
        >
          Proceder al pago
        </Link>
      </div>
    </div>
  )
}
