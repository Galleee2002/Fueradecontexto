import Link from 'next/link'
import { ProductCard } from '@/features/products/components/product-card'
import { Container } from '@/components/shared/layout/container'
import type { ProductCard as ProductCardType } from '@/features/products/types'

interface FeaturedProductsProps {
  products: ProductCardType[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="py-16 lg:py-20 bg-surface border-t border-border">
      <Container>

        {/* Header de sección */}
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-2">
            <p className="text-2xs font-medium tracking-[0.25em] uppercase text-muted-foreground">
              Selección
            </p>
            <h2 className="text-3xl lg:text-4xl font-normal font-serif">Destacados</h2>
          </div>
          <Link
            href="/productos"
            className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Ver todo →
          </Link>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* CTA mobile — visible solo en mobile */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/productos"
            className="border border-foreground text-foreground hover:bg-foreground hover:text-primary-foreground rounded-none px-10 py-3.5 text-xs font-medium tracking-[0.2em] uppercase transition-colors"
          >
            Ver todo →
          </Link>
        </div>

      </Container>
    </section>
  )
}
