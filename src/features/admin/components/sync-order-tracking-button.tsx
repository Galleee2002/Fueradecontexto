'use client'

import { useState, useTransition } from 'react'
import { RefreshCw } from 'lucide-react'
import { syncAdminOrderTracking } from '../actions/order-actions'

interface SyncOrderTrackingButtonProps {
  id: string
  disabled?: boolean
}

export function SyncOrderTrackingButton({ id, disabled = false }: SyncOrderTrackingButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  function handleSync() {
    startTransition(async () => {
      const result = await syncAdminOrderTracking(id)
      setMessage(result.ok ? 'Tracking actualizado' : result.error ?? 'No se pudo actualizar el tracking.')
    })
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleSync}
        disabled={disabled || isPending}
        className="inline-flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Actualizar tracking"
        title="Actualizar tracking"
      >
        <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} strokeWidth={1.5} />
      </button>
      {message ? <span className="hidden text-xs text-muted-foreground xl:inline">{message}</span> : null}
    </div>
  )
}
