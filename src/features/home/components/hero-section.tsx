import Link from 'next/link'
import { Container } from '@/shared/ui/layout/container'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/80 bg-[#ece9e3]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0))]" />
      <Container className="relative">
        <div className="flex min-h-[calc(100dvh-4.6rem)] items-center justify-center py-14 sm:py-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center space-y-9 text-center sm:space-y-11">
            <p className="brand-kicker">Colección 2026</p>
            <div className="space-y-6 sm:space-y-7">
              <h1 className="text-balance text-[clamp(3.8rem,10vw,8rem)] font-semibold leading-[0.88] tracking-[-0.075em] text-hero-ink">
                Prendas con
                <br />
                presencia propia.
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-foreground/72 sm:text-xl">
                Una tienda pensada como editorial de producto: piezas reales, navegación limpia y una compra sin fricción.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 pt-2 sm:flex-row sm:gap-4">
              <Link href="/productos" className="brand-button-primary">
                Explorar colección
              </Link>
              <Link href="/ayuda" className="brand-button-secondary">
                Resolver dudas
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
