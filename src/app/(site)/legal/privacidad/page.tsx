import { Container } from '@/shared/ui/layout/container'
import { PageHeader } from '@/shared/ui/layout/page-header'

export default function PrivacidadPage() {
  return (
    <main className="pb-20 lg:pb-0">
      <Container>
        <PageHeader
          title="Política de Privacidad"
          breadcrumb={[
            { label: 'Inicio', href: '/' },
            { label: 'Política de Privacidad' },
          ]}
        />

        <section className="py-10 md:py-14">
          <div className="rounded-xl border border-border bg-surface p-6 md:p-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              Usamos los datos que compartís en checkout o cuenta para procesar pedidos, coordinar
              envíos y responder consultas. No pedimos más información de la necesaria para operar la tienda.
            </p>
            <p>
              Los pagos se procesan a través de proveedores externos como Mercado Pago. Fueradecontexto
              no almacena datos completos de tarjetas ni credenciales sensibles de pago.
            </p>
            <p>
              Si necesitas corregir o actualizar tu información de contacto, podés escribirnos a
              hola@fueradecontexto.com indicando el correo usado en tu compra.
            </p>
          </div>
        </section>
      </Container>
    </main>
  )
}
