import { Container } from "@/components/shared/layout/container";

export function ManifiestoSection() {
  return (
    <section className="bg-background py-20 md:py-24">
      <Container>
        <div className="mx-auto grid max-w-4xl gap-12 lg:grid-cols-[minmax(0,72px)_1fr]">
          <div className="about-reveal hidden items-start justify-center lg:flex">
            <span className="mt-2 h-24 w-px bg-border" aria-hidden="true" />
          </div>
          <div className="space-y-8">
            <div className="about-reveal space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Manifiesto
              </p>
              <h2 className="text-4xl font-normal font-serif sm:text-5xl">
                Nuestra historia.
              </h2>
              <div className="h-px bg-border max-w-xs" />
            </div>
            <div className="space-y-7 text-balance text-lg leading-relaxed text-muted-foreground md:max-w-[68ch]">
              <p className="about-reveal about-reveal-delay-1">
                Fueradecontexto nació de una pregunta simple: ¿por qué la moda
                tiene que seguir reglas? Desde el principio, apostamos por
                piezas que desafían lo convencional y celebran a quienes se
                atreven a escribir sus propias normas.
              </p>
              <p className="about-reveal about-reveal-delay-2">
                Cada colección es el resultado de meses de búsqueda, de diálogos
                con artesanos, de telas tocadas y rechazadas hasta encontrar la
                que merece existir. No fabricamos volumen. Fabricamos
                significado.
              </p>
              <blockquote className="about-reveal about-reveal-delay-3 border-l border-primary/35 pl-6 font-serif text-2xl leading-tight text-foreground sm:text-3xl">
                "No diseñamos para gustar a todos. Diseñamos para resonar con
                quienes se reconocen en lo singular."
              </blockquote>
              <p className="about-reveal about-reveal-delay-4">
                Creemos que la ropa no es solo lo que llevas puesto: es el
                argumento con el que te presentas al mundo. Y ese argumento
                merece ser honesto, singular y completamente tuyo.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
