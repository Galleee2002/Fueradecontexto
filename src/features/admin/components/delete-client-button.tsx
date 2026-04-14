'use client'

import { useEffect, useState, useTransition } from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'
import { deleteAdminClientOrders } from '../actions/order-actions'

interface DeleteClientButtonProps {
  customerEmail: string
  customerName: string
  totalOrders: number
  totalSpent: number
}

export function DeleteClientButton({
  customerEmail,
  customerName,
  totalOrders,
  totalSpent,
}: DeleteClientButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isPending) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isPending])

  function handleDelete() {
    startTransition(async () => {
      await deleteAdminClientOrders(customerEmail)
      setIsOpen(false)
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label={`Eliminar cliente ${customerName}`}
        className="inline-flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
      >
        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/55 p-4"
          onClick={() => !isPending && setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-client-title-${customerEmail}`}
            className="w-full max-w-md border border-border bg-background shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  <p
                    id={`delete-client-title-${customerEmail}`}
                    className="text-xs font-medium tracking-widest uppercase"
                  >
                    Confirmar eliminación
                  </p>
                </div>
                <h3 className="text-lg font-medium text-foreground">
                  ¿Está seguro de realizar esta acción?
                </h3>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                aria-label="Cerrar diálogo"
                className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="text-sm text-foreground">
                  Se ocultará el cliente <span className="font-medium">{customerName}</span> del
                  panel de administración.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{customerEmail}</p>
              </div>

              <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <p className="font-medium">Al confirmar se pierde visibilidad de:</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>{totalOrders} {totalOrders === 1 ? 'orden asociada' : 'órdenes asociadas'}.</li>
                  <li>Total histórico de ${totalSpent.toLocaleString('es-AR')} en este cliente.</li>
                  <li>El cliente en la lista de `/admin/clientes`.</li>
                  <li>Las órdenes asociadas en `/admin/ordenes` y en `/cuenta`.</li>
                </ul>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="border border-border px-4 py-2 text-xs font-medium tracking-widest uppercase text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="bg-red-600 px-4 py-2 text-xs font-medium tracking-widest uppercase text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  {isPending ? 'Eliminando...' : 'Borrar cliente'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
