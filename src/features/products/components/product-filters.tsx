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
    <div className="space-y-8">
      {/* Categoría */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
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
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
          Ordenar
        </h3>
        <select
          value={sort ?? 'newest'}
          onChange={(e) => setSort(e.target.value === 'newest' ? undefined : e.target.value)}
          className="w-full text-sm border border-border bg-background text-foreground rounded-none px-3 py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
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
          className="text-xs underline text-muted-foreground hover:text-foreground transition-colors"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  )
}
