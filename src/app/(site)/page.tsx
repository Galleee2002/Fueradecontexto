import { HeroSection } from '@/features/home/components/hero-section'
import { CategoriesGrid } from '@/features/home/components/categories-grid'
import { FeaturedProducts } from '@/features/home/components/featured-products'
import { ServicesStrip } from '@/features/home/components/services-strip'
import { fetchFeaturedProducts } from '@/features/home/queries/home-queries'
import { fetchProductCategories } from '@/features/products/queries/product-queries'

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    fetchFeaturedProducts(),
    fetchProductCategories(),
  ])

  return (
    <main>
      <HeroSection />
      <CategoriesGrid categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <ServicesStrip />
    </main>
  )
}
