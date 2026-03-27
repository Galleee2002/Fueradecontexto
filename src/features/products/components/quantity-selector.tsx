'use client'

import { Minus, Plus } from 'lucide-react'

interface QuantitySelectorProps {
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
}

export function QuantitySelector({ value, onChange, min = 1, max = 10 }: QuantitySelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
        Cantidad
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="h-11 w-11 sm:h-9 sm:w-9 border border-border flex items-center justify-center hover:bg-surface transition-colors disabled:opacity-40"
          aria-label="Disminuir cantidad"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="text-sm w-6 text-center font-medium">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="h-11 w-11 sm:h-9 sm:w-9 border border-border flex items-center justify-center hover:bg-surface transition-colors disabled:opacity-40"
          aria-label="Aumentar cantidad"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
