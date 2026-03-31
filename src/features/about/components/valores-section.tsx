import { Fingerprint, Scissors, Zap } from "lucide-react";
import { Container } from "@/components/shared/layout/container";

const valores = [
  {
    icon: Fingerprint,
    title: "Autenticidad",
    subtitle: "Sin disfraz editorial",
    description:
      "Cada pieza nace de una visión propia. Nunca copiamos tendencias — las ignoramos para crear las nuestras.",
  },
  {
    icon: Scissors,
    title: "Artesanía",
    subtitle: "Tiempo como materia prima",
    description:
      "Trabajamos con talleres que entienden que la prisa es el enemigo de lo bien hecho. Cada costura importa.",
  },
  {
    icon: Zap,
    title: "Impacto",
    subtitle: "Presencia que permanece",
    description:
      "Diseñamos para que quien te vea recuerde exactamente lo que llevabas puesto. Sin esfuerzo. Sin explicaciones.",
  },
];

export function ValoresSection() {
  return (
    <section className="bg-surface py-20 md:py-24">
      <Container>
        <div className="space-y-16">
          <div className="about-reveal text-center space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Valores
            </p>
            <h2 className="text-4xl font-normal font-serif sm:text-5xl">
              Nuestros pilares.
            </h2>
            <div className="h-px bg-border max-w-xs mx-auto" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {valores.map(({ icon: Icon, title, subtitle, description }, index) => (
              <article
                key={title}
                className="about-reveal group relative overflow-hidden border border-border bg-background p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/35"
                style={{ animationDelay: `${index * 120 + 100}ms` }}
              >
                <div className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
                <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface transition-colors duration-300 group-hover:border-primary/35 group-hover:bg-primary-subtle">
                  <Icon className="h-4 w-4 stroke-[1.75] text-foreground transition-colors duration-300 group-hover:text-primary" />
                </div>
                <h3 className="text-2xl font-normal font-serif">{title}</h3>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {subtitle}
                </p>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
