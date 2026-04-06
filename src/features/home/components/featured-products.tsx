import Link from 'next/link'
import Image from 'next/image'
import { ProductDetailCard } from '@/features/products/components/product-detail-card'
import { Container } from '@/components/shared/layout/container'
import { cn } from '@/lib/utils/cn'
import { formatPrice } from '@/lib/utils/format-price'
import type { ProductCard as ProductCardType } from '@/features/products/types'

interface FeaturedProductsProps {
  products: ProductCardType[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-surface border-t border-border">
      <Container>

        {/* Header de sección */}
        <div className="flex items-end justify-between mb-6 sm:mb-10">
          <div className="space-y-2">
            <p className="text-2xs font-medium tracking-[0.25em] uppercase text-muted-foreground">
              Selección
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal font-serif">Destacados</h2>
          </div>
          <Link
            href="/productos"
            className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Ver todo →
          </Link>
        </div>

        {/* Lista mobile */}
        <div className="sm:hidden border-y border-border/60">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/productos/${product.slug}`}
              className="group flex items-center gap-3 py-4 border-b border-border last:border-b-0"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-background">
                <Image
                  src={product.imageUrl}
                  alt={`${product.name} — Fueradecontexto`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              <div className="min-w-0 space-y-1.5">
                <p className="text-2xs font-medium tracking-[0.25em] uppercase text-muted-foreground truncate">
                  {product.category}
                </p>
                <h3 className="text-base font-medium leading-tight text-foreground truncate">
                  {product.name}
                </h3>
                <p className="text-base font-semibold text-foreground">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Grid de productos desktop/tablet */}
        <div
          className={cn(
            'hidden sm:grid lg:grid-cols-4 gap-4 lg:gap-6',
            products.length === 1
              ? 'sm:grid-cols-2 max-w-[32rem] mx-auto lg:max-w-none lg:mx-0'
              : 'sm:grid-cols-2',
          )}
        >
          {products.map((product) => (
            <ProductDetailCard key={product.id} {...product} />
          ))}
        </div>

        {/* CTA mobile — visible solo en mobile */}
        <div className="mt-6 sm:mt-10 flex justify-center sm:hidden">
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
