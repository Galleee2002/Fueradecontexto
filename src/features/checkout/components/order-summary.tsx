'use client'

import Image from 'next/image'
import { useCart } from '@/features/cart'
import { formatPrice } from '@/shared/lib/format-price'
import type { ShippingQuote } from '../types'

interface OrderSummaryProps {
  shippingQuote: ShippingQuote | null
  isShippingQuoteLoading?: boolean
}

export function OrderSummary({ shippingQuote, isShippingQuoteLoading = false }: OrderSummaryProps) {
  const { items, totalPrice } = useCart()

  const envio = shippingQuote?.price ?? 0

  return (
    <div className="brand-panel-solid px-5 py-6 sm:px-6">
      <h3 className="mb-6 text-lg font-medium tracking-[-0.03em]">Tu pedido</h3>

      {/* Items */}
      <ul className="space-y-5">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1rem] border border-border bg-surface">
              <Image
                src={item.productImageUrl}
                alt={item.productName}
                fill
                sizes="64px"
                className="object-cover"
              />
              {/* Badge de cantidad */}
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-2xs font-medium text-primary-foreground">
                {item.quantity}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug line-clamp-2">{item.productName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.quantity} × {formatPrice(item.productPrice)}
              </p>
            </div>

            <p className="text-sm font-semibold shrink-0">
              {formatPrice(item.productPrice * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-3 border-t border-border pt-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Envío</span>
          <span className="text-muted-foreground">
            {isShippingQuoteLoading ? 'Cotizando…' : envio === 0 ? 'A calcular' : formatPrice(envio)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex justify-between border-t border-border pt-4">
        <span className="font-medium">Total</span>
        <span className="font-semibold text-lg">{formatPrice(totalPrice + envio)}</span>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        El envío se cotiza con Correo Argentino antes de generar el pago.
      </p>
    </div>
  )
}
