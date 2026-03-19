import type { Metadata } from 'next'
import { HeroAbout } from '@/features/about/components/hero-about'
import { ManifiestoSection } from '@/features/about/components/manifiesto-section'
import { ValoresSection } from '@/features/about/components/valores-section'
import { EquipoSection } from '@/features/about/components/equipo-section'

export const metadata: Metadata = {
  title: 'Quiénes somos — Fueradecontexto',
}

export default function QuienesSomosPage() {
  return (
    <main>
      <HeroAbout />
      <ManifiestoSection />
      <ValoresSection />
      <EquipoSection />
    </main>
  )
}
