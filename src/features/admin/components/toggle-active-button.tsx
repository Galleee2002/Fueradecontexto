'use client'

import { useTransition } from 'react'
import { toggleAdminProductActive } from '../actions/product-actions'

interface ToggleActiveButtonProps {
  id: string
  active: boolean
}

export function ToggleActiveButton({ id, active }: ToggleActiveButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      await toggleAdminProductActive(id, !active)
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={active ? 'Desactivar producto' : 'Activar producto'}
      className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center transition-colors focus:outline-none disabled:opacity-50"
    >
      <span
        className={`absolute inset-0 transition-colors ${active ? 'bg-primary' : 'bg-border'}`}
      />
      <span
        className={`relative h-3.5 w-3.5 bg-white shadow-sm transition-transform ${
          active ? 'translate-x-4' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
