'use client'

import Link from 'next/link'

export default function NuevoProductoError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-xl border border-primary/30 bg-primary/5 p-5 space-y-3">
        <h2 className="text-lg font-medium text-foreground">Error al cargar nuevo producto</h2>
        <p className="text-sm text-muted-foreground">
          Ocurrio un error inesperado en esta pantalla.
        </p>
        <p className="text-xs text-primary break-all">
          {error.message || 'Sin detalle disponible'}
        </p>
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={reset}
            className="px-3 py-2 text-xs border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            Reintentar
          </button>
          <Link
            href="/admin/productos"
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
          >
            Volver a productos
          </Link>
        </div>
      </div>
    </div>
  )
}
