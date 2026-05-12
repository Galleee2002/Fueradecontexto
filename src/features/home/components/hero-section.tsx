import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/shared/ui/layout/container'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/80 bg-neutral-950">
      <div className="absolute inset-0">
        <Image
          src="/img/hero.jpeg"
          alt="Colección de prendas en perchero"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-[0.82]"
        />
      </div>
      <Container className="relative">
        <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center py-12 sm:min-h-[calc(100dvh-4.6rem)] sm:py-20">
          <div className="mx-auto flex w-full min-w-0 max-w-4xl flex-col items-center space-y-8 text-center sm:space-y-11">
            <p className="brand-kicker !text-white">Colección 2026</p>
            <div className="w-full min-w-0 space-y-5 sm:space-y-7">
              <h1 className="text-balance text-[clamp(2.35rem,9.2vw,8rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-white sm:leading-[0.88] sm:tracking-[-0.075em]">
                Prendas con
                <br />
                presencia propia.
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/78 sm:text-xl">
                Prendas personalizadas que convierten ideas en identidad: diseño cuidado, detalles reales y piezas hechas
                para destacar.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 pt-2 sm:flex-row sm:gap-4">
              <Link href="/productos" className="brand-button-primary">
                Explorar colección
              </Link>
              <Link href="/ayuda" className="brand-button-secondary hero-secondary-solid">
                Resolver dudas
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
