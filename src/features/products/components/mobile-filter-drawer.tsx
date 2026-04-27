'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Container } from '@/shared/ui/layout/container'
import { ProductFilters } from './product-filters'
import { useProductFilters } from '../hooks/use-product-filters'

export function MobileFilterDrawer({ categories }: { categories: string[] }) {
  const [open, setOpen] = useState(false)
  const { hasFilters } = useProductFilters()

  return (
    <>
      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-[rgba(245,245,247,0.95)] backdrop-blur-xl lg:hidden">
        <Container>
          <button
            onClick={() => setOpen(true)}
            className="flex min-h-[56px] w-full items-center justify-between py-3.5"
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
          className="fixed inset-0 z-40 bg-foreground/38 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed bottom-0 inset-x-0 z-50 rounded-t-[1.8rem] border border-border bg-[rgba(245,245,247,0.98)] shadow-[0_-20px_40px_rgba(18,24,32,0.08)] transition-transform duration-300 lg:hidden ${
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
            className="brand-button-primary w-full"
          >
            Ver resultados
          </button>
        </div>
      </div>
    </>
  )
}
