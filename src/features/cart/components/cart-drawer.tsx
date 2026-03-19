'use client'

import Link from 'next/link'
import { useCart } from '../hooks/use-cart'
import { CartItem } from './cart-item'
import { EmptyState } from '@/components/shared/feedback/empty-state'

export function CartDrawer() {
  const { items, isEmpty, formattedTotal } = useCart()

  if (isEmpty) {
    return (
      <EmptyState
        title="Tu carrito está vacío"
        description="Explorá nuestra colección y encontrá algo que te guste."
        action={
          <Link
            href="/productos"
            className="border border-foreground text-foreground hover:bg-foreground hover:text-white rounded-none px-8 py-3 text-sm font-medium tracking-widest uppercase transition-colors"
          >
            Ver colección
          </Link>
        }
      />
    )
  }

  return (
    <div className="py-8">
      <div className="space-y-0">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="pt-8 space-y-4 border-t border-border mt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">{formattedTotal}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          El envío se calcula en el checkout.
        </p>
        <Link
          href="/checkout"
          className="bg-primary text-white hover:bg-[var(--color-primary-hover)] rounded-none px-8 py-4 text-sm font-medium tracking-widest uppercase transition-colors w-full text-center block"
        >
          Proceder al pago
        </Link>
      </div>
    </div>
  )
}
