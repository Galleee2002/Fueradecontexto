import { HeroSection } from '@/features/home/components/hero-section'
import { FeaturedProducts } from '@/features/home/components/featured-products'
import { FaqSection } from '@/features/home/components/faq-section'
import { ServicesStrip } from '@/features/home/components/services-strip'
import { fetchFeaturedProducts } from '@/features/home/queries/home-queries'

export default async function HomePage() {
  const featuredProducts = await fetchFeaturedProducts()

  return (
    <main>
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
      <FaqSection />
      <ServicesStrip />
    </main>
  )
}
