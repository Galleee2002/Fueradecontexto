'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ProductDetailCard } from '@/features/products/components/product-detail-card'
import { Container } from '@/shared/ui/layout/container'
import type { ProductCard as ProductCardType } from '@/entities/product'

interface FeaturedProductsProps {
  products: ProductCardType[]
}

const FEATURED_CATEGORY_TABS = [
  { id: 'Buzos' as const, label: 'Buzos' },
  { id: 'Remeras' as const, label: 'Remeras' },
  { id: 'Gorras' as const, label: 'Gorras' },
] as const

type FeaturedCategory = (typeof FEATURED_CATEGORY_TABS)[number]['id']

const MAX_FEATURED_CARDS = 4

function categoryMatches(productCategory: string, tab: FeaturedCategory): boolean {
  return productCategory.trim().toLowerCase() === tab.toLowerCase()
}

function initialFeaturedCategory(productList: ProductCardType[]): FeaturedCategory {
  for (const tab of FEATURED_CATEGORY_TABS) {
    if (productList.some((p) => categoryMatches(p.category, tab.id))) {
      return tab.id
    }
  }
  return 'Buzos'
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [activeCategory, setActiveCategory] = useState<FeaturedCategory>(() =>
    initialFeaturedCategory(products),
  )

  const cards = useMemo(() => {
    return products
      .filter((product) => categoryMatches(product.category, activeCategory))
      .sort((a, b) => {
        const inStock = Number(b.stock > 0) - Number(a.stock > 0)
        if (inStock !== 0) return inStock
        return b.stock - a.stock
      })
      .slice(0, MAX_FEATURED_CARDS)
  }, [activeCategory, products])

  if (products.length === 0) {
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
                Elegí una categoría para ver buzos, remeras o gorras destacadas en la tienda.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {FEATURED_CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={
                    activeCategory === tab.id
                      ? 'rounded-full border border-foreground bg-foreground px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-background'
                      : 'rounded-full border border-border bg-background px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-foreground/75 transition hover:border-foreground/35'
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="brand-panel-solid px-4 py-6 sm:px-8 sm:py-7">
            {cards.length > 0 ? (
              <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {cards.map((product) => (
                  <div key={product.id} id={`featured-product-${product.id}`} className="h-full min-w-0">
                    <ProductDetailCard {...product} autoSlide={false} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Todavía no hay productos en esta categoría. Probá con otra o mirá el catálogo completo.
              </p>
            )}

            <div className="mt-7 flex justify-center sm:justify-end">
              <Link
                href={`/productos?category=${encodeURIComponent(activeCategory)}`}
                className="brand-button-secondary"
              >
                Ver todos los productos
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
