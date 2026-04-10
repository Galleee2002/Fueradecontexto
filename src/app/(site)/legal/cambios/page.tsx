import { Container } from '@/shared/ui/layout/container'
import { PageHeader } from '@/shared/ui/layout/page-header'

export default function CambiosPage() {
  return (
    <main className="pb-20 lg:pb-0">
      <Container>
        <PageHeader
          title="Cambios & Devoluciones"
          breadcrumb={[
            { label: 'Inicio', href: '/' },
            { label: 'Cambios & Devoluciones' },
          ]}
        />

        <section className="py-10 md:py-14">
          <div className="rounded-xl border border-border bg-surface p-6 md:p-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              Si el producto llega con una falla o no coincide con lo comprado, escríbenos dentro
              de los primeros días posteriores a la entrega con fotos y número de orden.
            </p>
            <p>
              Para cambios por talle o preferencia, la prenda debe conservarse en perfecto estado,
              sin uso y con sus condiciones originales. La aprobación final depende de la revisión del caso.
            </p>
            <p>
              Antes de enviar cualquier devolución, contáctanos por nuestros canales de ayuda para
              coordinar el procedimiento correcto y evitar demoras.
            </p>
          </div>
        </section>
      </Container>
    </main>
  )
}
