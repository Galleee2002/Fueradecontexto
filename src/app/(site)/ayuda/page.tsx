import { Container } from '@/components/shared/layout/container'
import { PageHeader } from '@/components/shared/layout/page-header'

export default function AyudaPage() {
  return (
    <main className="pb-20 lg:pb-0">
      <Container>
        <PageHeader
          title="Ayuda"
          breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Ayuda' }]}
        />

        <section className="py-10 md:py-14">
          <div className="rounded-xl border border-border bg-surface p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-serif text-foreground">Centro de ayuda en construccion</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Esta seccion queda preparada para la siguiente iteracion. En el refinamiento vamos a
              definir contenido final de soporte, preguntas frecuentes y acceso rapido por tema.
            </p>
          </div>
        </section>
      </Container>
    </main>
  )
}
