'use client'

import { useState, useTransition } from 'react'
import { toggleAdminProductActive } from '../actions/product-actions'

interface ToggleActiveButtonProps {
  id: string
  active: boolean
  blocker?: string | null
}

export function ToggleActiveButton({ id, active, blocker }: ToggleActiveButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleToggle() {
    setError(null)

    if (!active && blocker) {
      setError(blocker)
      return
    }

    startTransition(async () => {
      const result = await toggleAdminProductActive(id, !active)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleToggle}
        disabled={isPending}
        aria-label={active ? 'Desactivar producto' : 'Activar producto'}
        aria-describedby={error ? `toggle-error-${id}` : undefined}
        title={!active && blocker ? blocker : undefined}
        className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border/80 bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      >
        <span
          className={`absolute inset-[2px] rounded-full transition-colors ${active ? 'bg-primary' : 'bg-border/80'}`}
        />
        <span
          className={`relative z-10 h-[18px] w-[18px] rounded-full bg-white shadow-[0_6px_14px_rgba(18,24,32,0.16)] transition-transform ${
            active ? 'translate-x-[22px]' : 'translate-x-[4px]'
          }`}
        />
      </button>
      {error ? (
        <p id={`toggle-error-${id}`} className="max-w-[15rem] text-[11px] leading-relaxed text-error-foreground" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
