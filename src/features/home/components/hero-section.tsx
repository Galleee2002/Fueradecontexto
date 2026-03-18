import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/layout/container";

export function HeroSection() {
  return (
    <section className="relative min-h-[92svh] bg-foreground overflow-hidden flex flex-col justify-end">
      <Image
        src="/img/fashion_model.png"
        alt="Fueradecontexto — Nueva colección 2026"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Overlay doble: lateral para desktop + vertical para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-foreground/25" />

      {/* Contenido */}
      <div className="relative z-10 pb-20 lg:pb-32">
        <Container>
          <div className="max-w-2xl lg:max-w-3xl space-y-8 lg:space-y-10">
            {/* Badge animado */}
            <div className="inline-flex items-center gap-3 border border-background/20 px-4 py-2 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-background/70">
                Nueva colección — 2026
              </p>
            </div>

            {/* Mensaje principal — orientado al usuario */}
            <h1 className="text-[60px] sm:text-[80px] lg:text-[104px] xl:text-[124px] font-light font-serif leading-[0.88] text-background">
              Viste lo que
              <br />
              <span className="italic">otros no se</span>
              <br />
              atreven.
            </h1>

            {/* Descripción breve */}
            <p className="text-sm lg:text-base text-background/55 max-w-sm lg:max-w-md leading-relaxed tracking-wide">
              Piezas diseñadas para quienes marcan tendencia, no para quienes la
              siguen.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 pt-2">
              <Link
                href="/productos"
                className="bg-primary text-primary-foreground hover:bg-[var(--color-primary-hover)] rounded-none px-10 py-4 text-[11px] font-medium tracking-[0.22em] uppercase transition-colors"
              >
                Ver colección
              </Link>
              <Link
                href="/productos"
                className="group flex items-center gap-3 text-[11px] font-medium tracking-[0.22em] uppercase text-background/55 hover:text-background transition-colors"
              >
                <span className="h-px w-6 bg-current block transition-all duration-300 group-hover:w-10" />
                Novedades
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
