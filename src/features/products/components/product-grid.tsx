import { ProductCard } from './product-card'
import { EmptyState } from '@/components/shared/feedback/empty-state'
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}
