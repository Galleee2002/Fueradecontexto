import { Container } from "@/components/shared/layout/container";

export function ManifiestoSection() {
  return (
    <section className="bg-background py-24">
      <Container>
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-normal font-serif">Nuestra historia.</h2>
          <div className="h-px bg-border max-w-xs mx-auto" />
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              Fueradecontexto nació de una pregunta simple: ¿por qué la moda
              tiene que seguir reglas? Desde el principio, apostamos por piezas
              que desafían lo convencional y celebran a quienes se atreven a
              escribir sus propias normas.
            </p>
            <p>
              Cada colección es el resultado de meses de búsqueda, de diálogos
              con artesanos, de telas tocadas y rechazadas hasta encontrar la
              que merece existir. No fabricamos volumen. Fabricamos significado.
            </p>
            <p>
              Creemos que la ropa no es solo lo que llevas puesto — es el
              argumento con el que te presentas al mundo. Y ese argumento merece
              ser honesto, singular, y completamente tuyo.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
