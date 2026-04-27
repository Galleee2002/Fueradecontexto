'use client'

import type { ProductColor } from '../types'

interface ColorSelectorProps {
  colors: ProductColor[]
  selected: string | null
  onChange: (color: string | null) => void
}

export function ColorSelector({ colors, selected, onChange }: ColorSelectorProps) {
  if (colors.length === 0) return null

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        Color{selected ? <> — <span className="text-foreground">{selected}</span></> : null}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {colors.map(({ name, hex }) => (
          <button
            key={name}
            onClick={() => onChange(selected === name ? null : name)}
            aria-label={`Color ${name}`}
            className={`h-9 w-9 rounded-full border border-white shadow-[0_8px_18px_rgba(18,24,32,0.12)] transition-all duration-150 focus:outline-none ${
              selected === name
                ? 'ring-2 ring-offset-2 ring-foreground'
                : 'ring-1 ring-transparent hover:ring-border'
            }`}
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>
    </div>
  )
}
