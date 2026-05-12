import Link from 'next/link'
import { ProductDetailCard } from '@/features/products/components/product-detail-card'
import { Container } from '@/shared/ui/layout/container'
import type { ProductCard as ProductCardType } from '@/entities/product'

interface FeaturedProductsProps {
  products: ProductCardType[]
}

const MAX_FEATURED = 4

type FeaturedTier = 'buzos' | 'remeras' | 'cobertores' | 'totebags' | 'other'

const TIER_PRIORITY: FeaturedTier[] = ['buzos', 'remeras', 'cobertores', 'totebags']

function productFeaturedTier(product: ProductCardType): FeaturedTier {
  const cat = product.category.toLowerCase().trim()
  const name = product.name.toLowerCase()
  const slug = product.slug.toLowerCase()

  if (cat === 'buzos' || cat.startsWith('buzo')) return 'buzos'
  if (cat === 'remeras' || cat.startsWith('remera')) return 'remeras'
  if (cat.includes('cobertor') || name.includes('cobertor') || slug.includes('cobertor')) {
    return 'cobertores'
  }
  if (cat.includes('tote') || name.includes('tote') || slug.includes('tote')) return 'totebags'

  return 'other'
}

function compareByStock(a: ProductCardType, b: ProductCardType): number {
  const inStock = Number(b.stock > 0) - Number(a.stock > 0)
  if (inStock !== 0) return inStock
  return b.stock - a.stock
}

function pickFeaturedProducts(products: ProductCardType[]): ProductCardType[] {
  const buckets = new Map<FeaturedTier, ProductCardType[]>()
  for (const tier of [...TIER_PRIORITY, 'other'] as const) {
    buckets.set(tier, [])
  }
  for (const p of products) {
    buckets.get(productFeaturedTier(p))!.push(p)
  }
  for (const list of buckets.values()) {
    list.sort(compareByStock)
  }

  const picked: ProductCardType[] = []
  const pickedIds = new Set<string>()

  for (const tier of TIER_PRIORITY) {
    const best = buckets.get(tier)![0]
    if (best && picked.length < MAX_FEATURED) {
      picked.push(best)
      pickedIds.add(best.id)
    }
  }

  if (picked.length < MAX_FEATURED) {
    const rest = [...products].filter((p) => !pickedIds.has(p.id)).sort(compareByStock)
    for (const p of rest) {
      if (picked.length >= MAX_FEATURED) break
      picked.push(p)
    }
  }

  return picked
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) {
    return null
  }

  const cards = pickFeaturedProducts(products)

  return (
    <section className="brand-page">
      <Container className="space-y-10 sm:space-y-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="brand-kicker">Productos destacados</p>
            <h3 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl">Nuestros productos</h3>
          </div>

          <div className="space-y-7">
            {cards.length > 0 ? (
              <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((product) => (
                  <div key={product.id} id={`featured-product-${product.id}`} className="min-w-0">
                    <ProductDetailCard {...product} autoSlide={false} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Todavía no hay productos para mostrar. Mirá el catálogo completo.
              </p>
            )}

            <div className="flex justify-center">
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
