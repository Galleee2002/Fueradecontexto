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
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Talle{selected ? <> — <span className="text-foreground">{selected}</span></> : null}
        </p>
        <button
          onClick={onGuideClick}
          className="text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Guía de talles
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onChange(size)}
            className={`min-h-[44px] rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
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
