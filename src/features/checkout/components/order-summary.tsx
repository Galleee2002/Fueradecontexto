'use client'

import Image from 'next/image'
import { useCart } from '@/features/cart/hooks/use-cart'
import { formatPrice } from '@/lib/utils/format-price'

export function OrderSummary() {
  const { items, totalPrice } = useCart()

  const envio = 0 // TODO: calcular costo de envío cuando el servicio esté disponible

  return (
    <div>
      <h3 className="font-serif text-lg mb-6">Tu pedido</h3>

      {/* Items */}
      <ul className="space-y-5">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4">
            <div className="relative w-16 h-16 bg-surface shrink-0 border border-border overflow-hidden">
              <Image
                src={item.productImageUrl}
                alt={item.productName}
                fill
                sizes="64px"
                className="object-cover"
              />
              {/* Badge de cantidad */}
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-primary-foreground text-2xs font-medium flex items-center justify-center rounded-full">
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

      <div className="mt-6 pt-6 border-t border-border space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Envío</span>
          <span className="text-muted-foreground">
            {envio === 0 ? 'A calcular' : formatPrice(envio)}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex justify-between">
        <span className="font-medium">Total</span>
        <span className="font-semibold text-lg">{formatPrice(totalPrice + envio)}</span>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Los impuestos y el costo de envío final se confirmarán antes del despacho.
      </p>
    </div>
  )
}
