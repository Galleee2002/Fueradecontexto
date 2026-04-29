'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ProductDetailCard } from '@/features/products/components/product-detail-card'
import { Container } from '@/shared/ui/layout/container'
import type { ProductCard as ProductCardType } from '@/entities/product'

interface FeaturedProductsProps {
  products: ProductCardType[]
}

type FeaturedView = 'con-stock' | 'top-precio' | 'por-categoria'
const MAX_FEATURED_CARDS = 4

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [activeView, setActiveView] = useState<FeaturedView>('con-stock')

  const byCategory = useMemo(() => {
    const grouped = new Map<string, ProductCardType[]>()

    products.forEach((product) => {
      const current = grouped.get(product.category) ?? []
      current.push(product)
      grouped.set(product.category, current)
    })

    return Array.from(grouped.entries())
      .filter(([, items]) => items.length > 0)
      .map(([label, items]) => {
        const featured = items.find((item) => item.stock > 0) ?? items[0]

        if (!featured) {
          return null
        }

        return {
          label,
          product: featured,
        }
      })
      .filter((group): group is { label: string; product: ProductCardType } => Boolean(group))
  }, [products])

  const cards = useMemo(() => {
    if (activeView === 'con-stock') {
      return products
        .filter((product) => product.stock > 0)
        .sort((a, b) => b.stock - a.stock)
        .slice(0, MAX_FEATURED_CARDS)
    }

    if (activeView === 'top-precio') {
      return [...products].sort((a, b) => a.price - b.price).slice(0, MAX_FEATURED_CARDS)
    }

    return byCategory.map((item) => item.product).slice(0, MAX_FEATURED_CARDS)
  }, [activeView, byCategory, products])

  if (products.length === 0 || cards.length === 0) {
    return null
  }

  return (
    <section className="brand-page">
      <Container className="space-y-10 sm:space-y-12">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="brand-kicker">Productos destacados</p>
              <h3 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl">Elegidos para comprar hoy</h3>
              <p className="max-w-2xl text-sm leading-relaxed text-foreground/70 sm:text-base">
                Selecciona una vista para descubrir productos por disponibilidad, precio o variedad de categorias.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'con-stock' as const, label: 'Con stock' },
                { id: 'top-precio' as const, label: 'Mejor precio' },
                { id: 'por-categoria' as const, label: 'Por categoria' },
              ].map((view) => (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setActiveView(view.id)}
                  className={
                    activeView === view.id
                      ? 'rounded-full border border-foreground bg-foreground px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-background'
                      : 'rounded-full border border-border bg-background px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-foreground/75 transition hover:border-foreground/35'
                  }
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>

          <div className="brand-panel-solid px-6 py-7 sm:px-8">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {cards.map((product) => (
                <div key={product.id} id={`featured-product-${product.id}`} className="h-full">
                  <ProductDetailCard {...product} autoSlide={false} />
                </div>
              ))}
            </div>

            <div className="mt-7 flex justify-center sm:justify-end">
              <Link href="/productos" className="brand-button-secondary">
                Ver todos los productos
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
