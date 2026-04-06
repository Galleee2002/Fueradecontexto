'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

interface StampSizeInteractiveProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  disabled?: boolean
}

export function StampSizeInteractive({
  options,
  selected,
  onChange,
  disabled = false,
}: StampSizeInteractiveProps) {
  const [showAllOptions, setShowAllOptions] = useState(false)

  function toggle(option: string) {
    onChange(
      selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option],
    )
  }

  const hasSelection = selected.length > 0

  if (!hasSelection && !showAllOptions) {
    return (
      <button
        type="button"
        onClick={() => setShowAllOptions(true)}
        disabled={disabled}
        className="w-full flex items-center justify-center flex-col gap-2 sm:gap-3 rounded-md border-2 sm:border border-dashed border-border bg-surface/40 px-4 sm:px-6 py-6 sm:py-8 hover:border-primary/50 hover:bg-surface transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="h-6 sm:h-8 w-6 sm:w-8 text-muted-foreground" strokeWidth={1.5} />
        <div className="text-center">
          <p className="text-sm sm:text-base font-medium text-foreground">Agregar tamaños</p>
          <p className="text-xs text-muted-foreground mt-0.5">Haz clic para seleccionar</p>
        </div>
      </button>
    )
  }

  return (
    <div className="space-y-3">
      {hasSelection && (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <div key={option} className="relative">
              <button
                type="button"
                disabled={disabled}
                onClick={() => toggle(option)}
                className={`px-3 sm:px-4 py-2.5 sm:py-2 border transition-all rounded-md text-xs sm:text-sm font-medium cursor-pointer min-h-[44px] flex items-center justify-center ${
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
      )}

      {showAllOptions && hasSelection && (
        <div className="space-y-2 pt-2 border-t border-border">
          <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground">
            Agregar más tamaños
          </p>
          <div className="flex flex-wrap gap-2">
            {options
              .filter((opt) => !selected.includes(opt))
              .map((option) => (
                <div key={option} className="relative">
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => toggle(option)}
                    className="px-3 sm:px-4 py-2.5 sm:py-2 border border-dashed border-border bg-background text-foreground hover:border-primary/50 hover:bg-surface transition-all rounded-md text-xs sm:text-sm font-medium cursor-pointer min-h-[44px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-3 w-3 mr-1 flex-shrink-0" strokeWidth={2} />
                    {option}
                  </button>
                  {option === '40x50' && (
                    <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 inline-flex items-center bg-primary text-primary-foreground px-1.5 sm:px-2 py-0.5 rounded-full text-2xs font-medium whitespace-nowrap shadow-sm">
                      Solo espalda
                    </span>
                  )}
                </div>
              ))}
          </div>
          <button
            type="button"
            onClick={() => setShowAllOptions(false)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Hecho
          </button>
        </div>
      )}

      {showAllOptions && !hasSelection && (
        <div className="space-y-3">
          <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground">
            Selecciona tamaños
          </p>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <div key={option} className="relative">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    toggle(option)
                  }}
                  className="px-3 sm:px-4 py-2.5 sm:py-2 border transition-all rounded-md text-xs sm:text-sm font-medium cursor-pointer min-h-[44px] flex items-center justify-center border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {option}
                </button>
                {option === '40x50' && (
                  <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 inline-flex items-center bg-primary text-primary-foreground px-1.5 sm:px-2 py-0.5 rounded-full text-2xs font-medium whitespace-nowrap shadow-sm">
                    Solo espalda
                  </span>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowAllOptions(false)}
            disabled={!hasSelection}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Hecho
          </button>
        </div>
      )}
    </div>
  )
}
