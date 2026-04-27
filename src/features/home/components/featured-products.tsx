'use client'

import { useMemo } from 'react'
import { ProductDetailCard } from '@/features/products/components/product-detail-card'
import { Container } from '@/shared/ui/layout/container'
import type { ProductCard as ProductCardType } from '@/entities/product'

interface FeaturedProductsProps {
  products: ProductCardType[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const featuredByCategory = useMemo(() => {
    const grouped = new Map<string, ProductCardType[]>()

    products.forEach((product) => {
      const current = grouped.get(product.category) ?? []
      current.push(product)
      grouped.set(product.category, current)
    })

    return Array.from(grouped.entries())
      .filter(([, items]) => items.length > 0)
      .map(([label, items], index) => {
        const featured = items.find((item) => item.stock > 0) ?? items[0]

        if (!featured) {
          return null
        }

        return {
          label,
          product: featured,
          slideDelayMs: 2800 + ((index % 5) + 1) * 350,
        }
      })
      .filter((group): group is { label: string; product: ProductCardType; slideDelayMs: number } => Boolean(group))
  }, [products])

  if (products.length === 0 || featuredByCategory.length === 0) {
    return null
  }

  return (
    <section className="brand-page">
      <Container className="space-y-10 sm:space-y-12">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="brand-kicker">Productos destacados</p>
              <h3 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
Categorias              </h3>
            </div>
       
          </div>

          <div className="brand-panel-solid px-6 py-7 sm:px-8">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featuredByCategory.map((category) => (
                <div key={category.label} id={`featured-category-${category.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <ProductDetailCard {...category.product} autoSlideDelayMs={category.slideDelayMs} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
