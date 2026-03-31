'use client'

import type { ProductColor } from '../types'

interface ColorSelectorProps {
  colors: ProductColor[]
  selected: string | null
  onChange: (color: string) => void
}

export function ColorSelector({ colors, selected, onChange }: ColorSelectorProps) {
  if (colors.length === 0) return null

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
        Color{selected ? <> — <span className="text-foreground">{selected}</span></> : null}
      </p>
      <div className="flex items-center gap-3">
        {colors.map(({ name, hex }) => (
          <button
            key={name}
            onClick={() => onChange(name)}
            aria-label={`Color ${name}`}
            className={`w-7 h-7 rounded-full transition-all duration-150 focus:outline-none ${
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
