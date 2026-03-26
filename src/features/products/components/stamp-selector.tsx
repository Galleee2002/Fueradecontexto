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
            className={`px-3 py-1.5 text-xs font-medium tracking-wide border transition-colors ${
              selected === option
                ? 'bg-foreground text-background border-foreground'
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
