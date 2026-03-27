'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Container } from '@/components/shared/layout/container'
import { ProductFilters } from './product-filters'
import { useProductFilters } from '../hooks/use-product-filters'

export function MobileFilterDrawer({ categories }: { categories: string[] }) {
  const [open, setOpen] = useState(false)
  const { hasFilters } = useProductFilters()

  return (
    <>
      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-background border-t border-border">
        <Container>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center justify-between w-full py-3.5 min-h-[56px]"
          >
            <span className="flex items-center gap-2 text-sm font-medium tracking-wide">
              <SlidersHorizontal className="h-4 w-4" />
              Filtrar y ordenar
            </span>
            {hasFilters && (
              <span className="bg-primary text-primary-foreground text-2xs w-4 h-4 rounded-full flex items-center justify-center">
                ●
              </span>
            )}
          </button>
        </Container>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-foreground/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed bottom-0 inset-x-0 z-50 lg:hidden bg-background transition-transform duration-300 ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <h2 className="text-sm font-medium tracking-widest uppercase">Filtros</h2>
          <button
            onClick={() => setOpen(false)}
            className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cerrar filtros"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 py-6 max-h-[60svh] overflow-y-auto">
          <ProductFilters categories={categories} />
        </div>

        <div className="px-4 pb-6 pt-4 border-t border-border">
          <button
            onClick={() => setOpen(false)}
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-3.5 text-xs font-medium tracking-widest uppercase transition-colors"
          >
            Ver resultados
          </button>
        </div>
      </div>
    </>
  )
}
