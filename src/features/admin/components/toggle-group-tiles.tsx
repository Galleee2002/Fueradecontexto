'use client'

interface ToggleGroupTilesProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  disabled?: boolean
}

export function ToggleGroupTiles({
  options,
  selected,
  onChange,
  disabled = false,
}: ToggleGroupTilesProps) {
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
        <button
          key={option}
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
      ))}
    </div>
  )
}
