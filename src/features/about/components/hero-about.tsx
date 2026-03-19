import Image from "next/image";
import { Container } from "@/components/shared/layout/container";

export function HeroAbout() {
  return (
    <section className="relative h-[60vh] overflow-hidden">
      <Image
        src="/about/hero.webp"
        alt="Quiénes somos — Fueradecontexto"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-foreground/40" />
      <div className="absolute inset-0 flex items-end pb-16">
        <Container>
          <h1 className="text-7xl font-light font-serif text-background">
            Fuera de contexto.
          </h1>
        </Container>
      </div>
    </section>
  );
}
