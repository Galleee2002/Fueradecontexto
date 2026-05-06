import { ProductCard } from './product-card'
import { EmptyState } from '@/shared/ui/feedback/empty-state'
import type { ProductCard as ProductCardType } from '../types'

interface ProductGridProps {
  products: ProductCardType[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="Sin resultados"
        description="No encontramos productos con los filtros seleccionados."
      />
    )
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <div key={product.id} className="h-full min-w-0">
          <ProductCard {...product} />
        </div>
      ))}
    </div>
  )
}
