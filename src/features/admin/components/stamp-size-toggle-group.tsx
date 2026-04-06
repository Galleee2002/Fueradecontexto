'use client'

interface StampSizeToggleGroupProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  disabled?: boolean
}

export function StampSizeToggleGroup({
  options,
  selected,
  onChange,
  disabled = false,
}: StampSizeToggleGroupProps) {
  function toggle(option: string) {
    onChange(
      selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option],
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <div key={option} className="relative">
          <button
            type="button"
            disabled={disabled}
            onClick={() => toggle(option)}
            className={`px-3 py-2 border transition-all rounded-md text-sm font-medium cursor-pointer ${
              selected.includes(option)
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-foreground hover:border-primary/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {option}
          </button>
          {option === '40x50' && (
            <span className="absolute -top-2 -right-2 inline-flex items-center bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-2xs font-medium whitespace-nowrap shadow-sm">
              Solo espalda
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
