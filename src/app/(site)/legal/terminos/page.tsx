import { Container } from '@/shared/ui/layout/container'
import { PageHeader } from '@/shared/ui/layout/page-header'

export default function TerminosPage() {
  return (
    <main className="pb-20 lg:pb-0">
      <Container>
        <PageHeader
          title="Términos & Condiciones"
          breadcrumb={[
            { label: 'Inicio', href: '/' },
            { label: 'Términos & Condiciones' },
          ]}
        />

        <section className="brand-page pt-0">
          <div className="brand-panel-solid space-y-6 p-6 text-sm leading-relaxed text-muted-foreground md:p-8">
            <p>
              Al comprar en Fueradecontexto aceptás que los productos, precios y disponibilidad
              pueden actualizarse sin previo aviso. La confirmación final del pedido ocurre una vez
              que el pago es aprobado y la orden queda registrada.
            </p>
            <p>
              Cada compra debe completarse con datos reales y actualizados para que podamos procesar
              el envío y contactarte si surge alguna incidencia. Nos reservamos el derecho de
              cancelar pedidos con información inconsistente o sospecha de fraude.
            </p>
            <p>
              Las imágenes y descripciones se publican con la mayor fidelidad posible, aunque puede
              haber leves diferencias de color o terminación según pantalla, lote o confección.
            </p>
          </div>
        </section>
      </Container>
    </main>
  )
}
