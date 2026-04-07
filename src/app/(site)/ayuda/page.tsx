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
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-xl border border-border bg-surface p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-serif text-foreground">
                Antes de escribirnos, revisá lo esencial
              </h2>
              <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
                <div>
                  <h3 className="text-foreground font-medium">Envíos</h3>
                  <p>
                    Despachamos pedidos a todo Argentina. Una vez acreditado el pago, vas a ver la
                    actualización en tu cuenta y recibirás seguimiento por el canal de contacto que
                    dejaste en checkout.
                  </p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium">Pagos</h3>
                  <p>
                    El cobro se procesa de forma segura con Mercado Pago. Aceptamos tarjetas,
                    saldo en cuenta y medios disponibles según la configuración del proveedor.
                  </p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium">Cambios y devoluciones</h3>
                  <p>
                    Si tu pedido llegó con un problema o necesitas gestionar un cambio, revisá
                    primero nuestra política y luego escribinos con número de orden y detalle del caso.
                  </p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium">Talles</h3>
                  <p>
                    Cada producto puede tener una guía distinta. Te recomendamos revisar la guía de
                    talles antes de comprar y usar la página de ayuda si necesitas una recomendación.
                  </p>
                </div>
              </div>
            </section>

            <aside className="rounded-xl border border-border bg-background p-6 md:p-8">
              <h2 className="text-xl font-serif text-foreground">Contacto rápido</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Si ya revisaste esta información y sigues con dudas, escríbenos con tu número de
                orden y la consulta específica para ayudarte más rápido.
              </p>
              <div className="mt-6 space-y-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Email</p>
                  <p className="mt-1 text-foreground">hola@fueradecontexto.com</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Horarios</p>
                  <p className="mt-1 text-foreground">Lunes a viernes, 10:00 a 18:00 hs</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Recomendación</p>
                  <p className="mt-1 text-foreground">
                    Incluí tu número de orden, nombre y una breve descripción del problema.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </Container>
    </main>
  )
}
