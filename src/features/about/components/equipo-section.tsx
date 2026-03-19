import Image from "next/image";
import { Container } from "@/components/shared/layout/container";

const equipo = [
  {
    nombre: "Valentina Ruiz",
    rol: "Directora creativa",
    imagen: "/about/equipo-1.webp",
  },
  {
    nombre: "Marcos Herrera",
    rol: "Director de producto",
    imagen: "/about/equipo-2.webp",
  },
  {
    nombre: "Sofía Delgado",
    rol: "Diseñadora senior",
    imagen: "/about/equipo-3.webp",
  },
];

export function EquipoSection() {
  return (
    <section className="bg-background py-24">
      <Container>
        <div className="space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-normal font-serif">El equipo.</h2>
            <div className="h-px bg-border max-w-xs" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipo.map(({ nombre, rol, imagen }) => (
              <div key={nombre} className="group space-y-4">
                <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                  <Image
                    src={imagen}
                    alt={`${nombre} — Fueradecontexto`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-normal font-serif">{nombre}</h3>
                  <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                    {rol}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
