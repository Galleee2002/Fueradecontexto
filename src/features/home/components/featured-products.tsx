'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ProductDetailCard } from '@/features/products/components/product-detail-card'
import { Container } from '@/shared/ui/layout/container'
import { cn } from '@/shared/lib/cn'
import { formatPrice } from '@/shared/lib/format-price'
import type { ProductCard as ProductCardType } from '@/entities/product'

interface FeaturedProductsProps {
  products: ProductCardType[]
}

const HOME_PRODUCT_CATEGORIES = [
  { label: 'Remeras', matches: ['Remeras'] },
  { label: 'Buzos', matches: ['Buzos'] },
  { label: 'Totebags', matches: ['Totebags', 'TOTE BAG'] },
  { label: 'Joyas', matches: ['Joyas'] },
] as const

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [activeCategory, setActiveCategory] = useState<(typeof HOME_PRODUCT_CATEGORIES)[number]['label']>('Remeras')

  if (products.length === 0) return null

  const selectedCategory =
    HOME_PRODUCT_CATEGORIES.find((category) => category.label === activeCategory) ?? HOME_PRODUCT_CATEGORIES[0]

  const filteredProducts = products.filter((product) =>
    (selectedCategory.matches as readonly string[]).includes(product.category),
  )

  return (
    <section className="border-t border-border bg-background py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-4">
            <h2 className="font-serif text-3xl font-normal tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Productos
            </h2>

            <div
              className="flex flex-wrap gap-2.5 sm:gap-3"
              role="tablist"
              aria-label="Filtrar productos por categoría"
            >
              {HOME_PRODUCT_CATEGORIES.map((category) => {
                const isActive = category.label === activeCategory

                return (
                  <button
                    key={category.label}
                    type="button"
                    role="tab"
                    id={`home-products-tab-${category.label.toLowerCase()}`}
                    aria-selected={isActive}
                    aria-controls={`home-products-panel-${category.label.toLowerCase()}`}
                    onClick={() => setActiveCategory(category.label)}
                    className={cn(
                      'inline-flex min-h-[44px] items-center justify-center rounded-full border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                      isActive
                        ? 'border-foreground bg-foreground text-background shadow-[0_10px_24px_rgba(26,26,26,0.12)]'
                        : 'border-border bg-background text-foreground/72 hover:border-foreground/30 hover:text-foreground',
                    )}
                  >
                    {category.label}
                  </button>
                )
              })}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div
              id={`home-products-panel-${activeCategory.toLowerCase()}`}
              role="tabpanel"
              aria-labelledby={`home-products-tab-${activeCategory.toLowerCase()}`}
              className="rounded-[1.5rem] border border-dashed border-border bg-background px-6 py-14 text-center sm:px-10"
            >
              <p className="font-serif text-2xl text-foreground sm:text-3xl">
                No hay productos cargados en {activeCategory}.
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                Esta categoría ya está preparada en la home y se mostrará automáticamente cuando se cree un producto desde el admin.
              </p>
            </div>
          ) : (
            <div
              id={`home-products-panel-${activeCategory.toLowerCase()}`}
              role="tabpanel"
              aria-labelledby={`home-products-tab-${activeCategory.toLowerCase()}`}
              className="space-y-0"
            >
              <div className="sm:hidden border-y border-border/60">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/productos/${product.slug}`}
                    className="group flex items-center gap-3 py-4 border-b border-border last:border-b-0"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-background">
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
                        {activeCategory}
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

              <div
                className={cn(
                  'hidden sm:grid gap-4 lg:gap-6',
                  filteredProducts.length === 1
                    ? 'sm:grid-cols-2 max-w-[32rem] mx-auto lg:max-w-none lg:mx-0 lg:grid-cols-4'
                    : 'sm:grid-cols-2 lg:grid-cols-4',
                )}
              >
                {filteredProducts.map((product) => (
                  <ProductDetailCard key={product.id} {...product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
