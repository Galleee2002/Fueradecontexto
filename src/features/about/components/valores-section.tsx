import { Fingerprint, Scissors, Zap } from "lucide-react";
import { Container } from "@/components/shared/layout/container";

const valores = [
  {
    icon: Fingerprint,
    title: "Autenticidad",
    description:
      "Cada pieza nace de una visión propia. Nunca copiamos tendencias — las ignoramos para crear las nuestras.",
  },
  {
    icon: Scissors,
    title: "Artesanía",
    description:
      "Trabajamos con talleres que entienden que la prisa es el enemigo de lo bien hecho. Cada costura importa.",
  },
  {
    icon: Zap,
    title: "Impacto",
    description:
      "Diseñamos para que quien te vea recuerde exactamente lo que llevabas puesto. Sin esfuerzo. Sin explicaciones.",
  },
];

export function ValoresSection() {
  return (
    <section className="bg-surface py-24">
      <Container>
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-normal font-serif">Nuestros pilares.</h2>
            <div className="h-px bg-border max-w-xs mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {valores.map(({ icon: Icon, title, description }) => (
              <div key={title} className="space-y-4">
                <Icon className="h-5 w-5 stroke-[1.5] text-primary" />
                <h3 className="text-xl font-normal font-serif">{title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
