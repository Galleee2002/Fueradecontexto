import Image from "next/image";
import { Container } from "@/components/shared/layout/container";

export function HeroAbout() {
  return (
    <section className="relative h-[68vh] min-h-[520px] overflow-hidden">
      <Image
        src="/about/hero.webp"
        alt="Quiénes somos — Fueradecontexto"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="about-hero-overlay absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_14%,rgba(233,30,140,0.22),transparent_42%)]" />
      <div className="absolute inset-0 flex items-end pb-14 md:pb-20">
        <Container>
          <div className="max-w-3xl space-y-5 text-background">
            <p className="about-reveal text-xs uppercase tracking-[0.24em] text-background/70">
              Quiénes somos
            </p>
            <h1 className="about-reveal about-reveal-delay-1 text-5xl font-light font-serif leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl">
              Fuera de contexto.
            </h1>
            <p className="about-reveal about-reveal-delay-2 max-w-2xl text-base leading-relaxed text-background/85 md:text-lg">
              Diseñamos indumentaria para quienes no negocian su identidad.
              Siluetas honestas, decisiones radicales y una elegancia que no
              pide permiso.
            </p>
          </div>
        </Container>
      </div>
    </section>
  );
}
