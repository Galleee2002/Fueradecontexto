import Link from 'next/link'
import { ProductCard } from './product-card'
import { fetchRelatedProducts } from '../queries/product-queries'
import { Container } from '@/components/shared/layout/container'

interface RelatedProductsProps {
  category: string
  currentSlug: string
}

export async function RelatedProducts({ category, currentSlug }: RelatedProductsProps) {
  const products = await fetchRelatedProducts(category, currentSlug, 4)
  if (products.length < 2) return null

  return (
    <section className="py-16 lg:py-20 bg-surface border-t border-border">
      <Container>
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-2">
            <p className="text-2xs font-medium tracking-[0.25em] uppercase text-muted-foreground">
              También te puede gustar
            </p>
            <h2 className="text-3xl lg:text-4xl font-normal font-serif">De la misma colección</h2>
          </div>
          <Link
            href={`/productos?category=${encodeURIComponent(category)}`}
            className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Ver todo →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </Container>
    </section>
  )
}
