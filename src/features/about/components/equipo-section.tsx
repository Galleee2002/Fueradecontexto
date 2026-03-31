import Link from "next/link";
import { Container } from "@/components/shared/layout/container";

const equipo = [
  {
    rol: "Dirección creativa",
    frase: "Define el pulso estético de cada colección.",
  },
  {
    rol: "Desarrollo de producto",
    frase: "Convierte ideas en piezas con precisión y carácter.",
  },
  {
    rol: "Relato de marca",
    frase: "Une imagen, lenguaje y experiencia en una sola voz.",
  },
];

export function EquipoSection() {
  return (
    <section className="bg-background py-20 md:py-24">
      <Container>
        <div className="space-y-16">
          <div className="about-reveal space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Equipo
            </p>
            <h2 className="text-4xl font-normal font-serif sm:text-5xl">
              El equipo.
            </h2>
            <div className="h-px bg-border max-w-xs" />
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
            <div className="about-reveal about-reveal-delay-1 space-y-6">
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Estamos armando esta sección para mostrar el detrás de escena de
                Fueradecontexto. Mientras tanto, dejamos una vista previa de los
                roles que sostienen cada colección.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/productos"
                  className="inline-flex items-center justify-center border border-foreground px-5 py-2.5 text-sm uppercase tracking-[0.14em] transition-colors duration-300 hover:bg-foreground hover:text-background"
                >
                  Ver colecciones
                </Link>
                <a
                  href="mailto:hola@fueradecontexto.com"
                  className="inline-flex items-center justify-center border border-border px-5 py-2.5 text-sm uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-300 hover:border-primary/40 hover:text-primary"
                >
                  Escribirnos
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {equipo.map((item, index) => (
                <article
                  key={item.rol}
                  className="about-reveal border border-border bg-surface p-5"
                  style={{ animationDelay: `${index * 140 + 220}ms` }}
                >
                  <h3 className="font-serif text-2xl">{item.rol}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.frase}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
