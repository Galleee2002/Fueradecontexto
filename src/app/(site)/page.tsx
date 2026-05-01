import type { Metadata } from 'next'
import { HeroSection } from '@/features/home/components/hero-section'
import { FeaturedProducts } from '@/features/home/components/featured-products'
import { FaqSection } from '@/features/home/components/faq-section'
import { fetchFeaturedProducts } from '@/features/home/queries/home-queries'

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'Descubre la coleccion de Fueradecontexto: indumentaria y accesorios con estetica minimalista.',
  alternates: { canonical: '/' },
}

export default async function HomePage() {
  const featuredProducts = await fetchFeaturedProducts()

  return (
    <main>
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
      <FaqSection />
    </main>
  )
}
