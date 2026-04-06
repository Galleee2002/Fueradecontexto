import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/layout/container";

export function HeroSection() {
  return (
    <section className="relative min-h-[92svh] overflow-hidden flex flex-col justify-end">
      {/* Imagen de fondo */}
      <Image
        src="/img/hero-img.jpeg"
        alt="Colección Fuera de Contexto"
        fill
        className="object-cover"
        priority
        quality={85}
      />
      
      {/* Overlay lateral — crea profundidad hacia el texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/50 to-transparent" />
      {/* Overlay vertical — legibilidad del texto inferior */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-foreground/20" />

      {/* Contenido */}
      <div className="relative z-10 pb-8 sm:pb-20 lg:pb-36 pt-16 sm:pt-32">
        <Container>
          <div className="max-w-2xl lg:max-w-[56rem] space-y-6 lg:space-y-8">

            {/* Badge */}
            <div className="inline-flex items-center gap-3 border border-white/15 px-4 py-2 backdrop-blur-sm bg-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <p className="text-[10px] font-medium tracking-[0.35em] uppercase text-white/60">
                Nueva colección — 2026
              </p>
            </div>

            {/* Titular principal */}
            <h1
              className="font-serif font-light text-white leading-[0.88] tracking-[-0.01em]"
              style={{ fontSize: "clamp(3.5rem, 9vw, 7.75rem)" }}
            >
              Viste lo que
              <br />
              <em className="not-italic italic text-white/90">otros no se</em>
              <br />
              atreven.
            </h1>

            {/* Línea divisoria sutil */}
            <div className="w-12 h-px bg-white/25" />

            {/* Descripción */}
            <p className="text-sm sm:text-base lg:text-lg text-white/70 max-w-xs sm:max-w-sm leading-relaxed font-light tracking-wide">
              Piezas diseñadas para quienes marcan tendencia.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-8 pt-2">
              <Link
                href="/productos"
                className="group relative w-full sm:w-auto overflow-hidden bg-primary text-white px-10 py-4 text-[11px] font-medium tracking-[0.28em] uppercase transition-all duration-300 hover:bg-primary/90"
              >
                <span className="relative z-10">Productos</span>
                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>

              <Link
                href="/talles"
                className="group flex items-center gap-3 text-[11px] font-medium tracking-[0.28em] uppercase text-white/45 hover:text-white/90 transition-colors duration-300"
              >
                <span className="h-px w-6 bg-current block transition-all duration-500 group-hover:w-12" />
                Talles
              </Link>
            </div>

          </div>
        </Container>
      </div>

      {/* Indicador scroll sutil */}
      <div className="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-2 opacity-30">
        <span className="text-[9px] tracking-[0.4em] uppercase text-white rotate-90 translate-y-4">
          Scroll
        </span>
        <span className="w-px h-10 bg-white/50" />
      </div>
    </section>
  );
}

