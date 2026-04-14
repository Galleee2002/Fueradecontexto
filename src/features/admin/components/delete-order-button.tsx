'use client'

import { useState, useTransition } from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { deleteAdminOrder } from '../actions/order-actions'

interface DeleteOrderButtonProps {
  id: string
  customerName: string
}

export function DeleteOrderButton({ id, customerName }: DeleteOrderButtonProps) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      await deleteAdminOrder(id)
      setConfirming(false)
    })
  }

  if (confirming) {
    return (
      <div className="flex items-center justify-end gap-2">
        <div className="flex items-center gap-2 border border-red-200 bg-red-50 px-2.5 py-1 text-red-700 shadow-sm">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
          <span className="hidden whitespace-nowrap text-xs sm:block">¿Eliminar?</span>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 px-2 py-0.5 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? '...' : 'Sí'}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={isPending}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            No
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      aria-label={`Eliminar orden de ${customerName}`}
      className="inline-flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
    >
      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
    </button>
  )
}
