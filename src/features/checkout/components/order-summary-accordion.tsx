'use client'

import { useState } from 'react'
import { ShoppingBag, ChevronDown } from 'lucide-react'
import { formatPrice } from '@/shared/lib/format-price'

export function OrderSummaryAccordion({
  children,
  total,
}: {
  children: React.ReactNode
  total: number
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Toggle button — mobile only */}
      <button
        className="lg:hidden w-full flex items-center justify-between bg-surface border border-border px-4 py-3.5 text-sm font-medium mb-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          {isOpen ? 'Ocultar resumen' : 'Ver resumen del pedido'}
        </span>
        <span className="flex items-center gap-2">
          <span className="font-semibold">{formatPrice(total)}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {/* Content — always visible on lg, conditional on mobile */}
      <aside
        className={`bg-surface p-8 border border-border lg:h-fit lg:sticky lg:top-24 ${
          isOpen ? 'block' : 'hidden lg:block'
        }`}
      >
        {children}
      </aside>
    </>
  )
}
