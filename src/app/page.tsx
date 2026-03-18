import { HeroSection } from '@/features/home/components/hero-section'
import { CategoriesGrid } from '@/features/home/components/categories-grid'
import { FeaturedProducts } from '@/features/home/components/featured-products'
import { ServicesStrip } from '@/features/home/components/services-strip'
import { fetchFeaturedProducts } from '@/features/home/queries/home-queries'

export default async function HomePage() {
  const featuredProducts = await fetchFeaturedProducts()

  return (
    <main>
      {/* 1. Banner full-screen con heading editorial */}
      <HeroSection />

      {/* 2. Categorías: Buzos, Remeras, Gorras, Bijuterie */}
      <CategoriesGrid />

      {/* 3. Productos destacados (admin-selectable en producción) */}
      <FeaturedProducts products={featuredProducts} />

      {/* 4. Servicios: envíos, descuentos, formas de pago */}
      <ServicesStrip />
    </main>
  )
}
