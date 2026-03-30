import { Container } from "@/components/shared/layout/container";

export function EquipoSection() {
  return (
    <section className="bg-background py-24">
      <Container>
        <div className="space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-normal font-serif">El equipo.</h2>
            <div className="h-px bg-border max-w-xs" />
          </div>
          <p className="text-muted-foreground">Próximamente.</p>
        </div>
      </Container>
    </section>
  );
}
