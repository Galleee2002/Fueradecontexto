'use client'

import { useProductFilters } from '../hooks/use-product-filters'

const SORT_OPTIONS = [
  { label: 'Novedades', value: 'newest' },
  { label: 'Menor precio', value: 'price-asc' },
  { label: 'Mayor precio', value: 'price-desc' },
]

export function ProductFilters({ categories }: { categories: string[] }) {
  const { category, sort, setCategory, setSort, resetFilters, hasFilters } = useProductFilters()

  return (
    <div className="brand-panel-solid space-y-8 px-5 py-6">
      {/* Categoría */}
      <div>
        <h3 className="mb-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Categoría
        </h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setCategory(undefined)}
              className="flex items-center gap-2 text-sm transition-colors"
            >
              <span
                className={`h-1 w-1 rounded-full shrink-0 ${!category ? 'bg-primary' : 'bg-transparent'}`}
              />
              <span
                className={!category ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}
              >
                Todas
              </span>
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => setCategory(cat)}
                className="flex items-center gap-2 text-sm transition-colors"
              >
                <span
                  className={`h-1 w-1 rounded-full shrink-0 ${category === cat ? 'bg-primary' : 'bg-transparent'}`}
                />
                <span
                  className={
                    category === cat
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }
                >
                  {cat}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Ordenar */}
      <div>
        <h3 className="mb-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Ordenar
        </h3>
        <select
          value={sort ?? 'newest'}
          onChange={(e) => setSort(e.target.value === 'newest' ? undefined : e.target.value)}
          className="brand-select"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button
          onClick={resetFilters}
          className="text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  )
}
