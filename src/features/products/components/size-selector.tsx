'use client'

interface SizeSelectorProps {
  sizes: string[]
  selected: string | null
  onChange: (size: string) => void
  onGuideClick: () => void
}

export function SizeSelector({ sizes, selected, onChange, onGuideClick }: SizeSelectorProps) {
  if (sizes.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          Talle{selected ? <> — <span className="text-foreground">{selected}</span></> : null}
        </p>
        <button
          onClick={onGuideClick}
          className="text-[11px] underline underline-offset-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          Guía de talles
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onChange(size)}
            className={`px-3 py-1.5 text-xs uppercase font-medium tracking-wider border transition-colors ${
              selected === size
                ? 'bg-foreground text-background border-foreground'
                : 'border-border text-foreground hover:border-foreground'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
