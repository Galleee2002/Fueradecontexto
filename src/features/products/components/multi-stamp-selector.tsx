'use client'

interface MultiStampSelectorProps {
  label: string
  options: string[]
  selected: string[]
  onChange: (values: string[]) => void
}

export function MultiStampSelector({ label, options, selected, onChange }: MultiStampSelectorProps) {
  if (options.length === 0) return null

  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option))
    } else {
      onChange([...selected, option])
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
        {label}
        {selected.length > 0 ? (
          <>
            {' '}
            — <span className="text-foreground">{selected.join(', ')}</span>
          </>
        ) : null}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleToggle(option)}
            className={`min-h-[44px] rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
              selected.includes(option)
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
