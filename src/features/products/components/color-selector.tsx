'use client'
import { useState } from 'react'

const COLOR_OPTIONS = [
  { name: 'Negro',   hex: '#1A1A1A' },
  { name: 'Blanco',  hex: '#F5F5F5' },
  { name: 'Camel',   hex: '#C19A6B' },
  { name: 'Fucsia',  hex: '#E91E8C' },
  { name: 'Marengo', hex: '#4A4E54' },
]

export function ColorSelector() {
  const [selected, setSelected] = useState(COLOR_OPTIONS[0].name)

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
        Color — <span className="text-foreground">{selected}</span>
      </p>
      <div className="flex items-center gap-3">
        {COLOR_OPTIONS.map((color) => (
          <button
            key={color.name}
            onClick={() => setSelected(color.name)}
            aria-label={`Color ${color.name}`}
            className={`w-7 h-7 rounded-full transition-all duration-150 focus:outline-none ${
              selected === color.name
                ? 'ring-2 ring-offset-2 ring-foreground'
                : 'ring-1 ring-transparent hover:ring-border'
            }`}
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
    </div>
  )
}
