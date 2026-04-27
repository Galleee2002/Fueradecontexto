'use client'

interface StampSelectorProps {
  label: string
  options: string[]
  selected: string | null
  onChange: (value: string) => void
}

export function StampSelector({ label, options, selected, onChange }: StampSelectorProps) {
  if (options.length === 0) return null

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
        {label}{selected ? <> — <span className="text-foreground">{selected}</span></> : null}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`min-h-[44px] rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
              selected === option
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-foreground hover:border-foreground'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
