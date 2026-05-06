import type { Metadata } from 'next'
import { SITE_CONTACT_EMAIL } from '@/shared/config/site'
import { Container } from '@/shared/ui/layout/container'
import { PageHeader } from '@/shared/ui/layout/page-header'

export const metadata: Metadata = {
  title: 'Ayuda',
  description: 'Resuelve dudas sobre envios, pagos, cambios y recomendaciones antes de tu compra.',
  alternates: { canonical: '/ayuda' },
}

export default function AyudaPage() {
  return (
    <main className="pb-20 lg:pb-0">
      <Container>
        <PageHeader
          title="Ayuda"
          breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Ayuda' }]}
        />

        <section className="brand-page pt-0">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="brand-panel-solid p-6 md:p-8">
              <h2 className="text-2xl font-medium tracking-[-0.04em] text-foreground md:text-3xl">
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

            <aside className="brand-panel p-6 md:p-8">
              <h2 className="text-xl font-medium tracking-[-0.04em] text-foreground">Contacto rápido</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Si ya revisaste esta información y sigues con dudas, escríbenos con tu número de
                orden y la consulta específica para ayudarte más rápido.
              </p>
              <div className="mt-6 space-y-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Email</p>
                  <p className="mt-1 text-foreground">{SITE_CONTACT_EMAIL}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Horarios</p>
                  <p className="mt-1 text-foreground">Lunes a viernes, 08:00 a 20:00 hs</p>
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
