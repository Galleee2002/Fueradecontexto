'use client'

import { useState, useTransition } from 'react'
import { Trash2, AlertTriangle } from 'lucide-react'
import { deleteAdminProduct } from '../actions/product-actions'

interface DeleteProductButtonProps {
  id: string
  name: string
}

export function DeleteProductButton({ id, name }: DeleteProductButtonProps) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      await deleteAdminProduct(id)
      setConfirming(false)
    })
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2 bg-background border border-border px-2 py-1 shadow-sm z-10">
        <AlertTriangle className="h-3.5 w-3.5 text-primary shrink-0" strokeWidth={1.5} />
        <span className="text-xs text-foreground whitespace-nowrap hidden sm:block">
          ¿Eliminar?
        </span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-xs font-medium text-primary-foreground bg-foreground px-2 py-0.5 hover:bg-primary transition-colors disabled:opacity-50"
        >
          {isPending ? '...' : 'Sí'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          No
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      aria-label={`Eliminar ${name}`}
      className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-none"
    >
      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
    </button>
  )
}
