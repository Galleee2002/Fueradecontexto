'use client'

import { formatPrice } from '@/shared/lib/format-price'

interface StampSelectorProps {
  label: string
  options: string[]
  selected: string | null
  onChange: (value: string | null) => void
  upcharges?: Record<string, number>
}

export function StampSelector({ label, options, selected, onChange, upcharges }: StampSelectorProps) {
  if (options.length === 0) return null

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
        {label}{selected ? <> — <span className="text-foreground">{selected}</span></> : null}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const upcharge = upcharges?.[option] ?? 0
          const isSelected = selected === option
          const ariaLabel = upcharge > 0
            ? `${option}, recargo ${formatPrice(upcharge)}`
            : option

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(isSelected ? null : option)}
              aria-label={ariaLabel}
              aria-pressed={isSelected}
              className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors sm:min-h-[44px] sm:flex-row sm:gap-1.5 ${
                isSelected
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-foreground hover:border-foreground'
              }`}
            >
              <span>{option}</span>
              {upcharge > 0 && (
                <span
                  className={`text-[10px] font-normal tracking-[0.12em] tabular-nums ${
                    isSelected ? 'text-background/75' : 'text-muted-foreground'
                  }`}
                >
                  +{formatPrice(upcharge)}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
