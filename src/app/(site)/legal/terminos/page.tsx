import type { Metadata } from 'next'
import { Container } from '@/shared/ui/layout/container'
import { PageHeader } from '@/shared/ui/layout/page-header'
import { SITE_CONTACT_EMAIL, SITE_NAME } from '@/shared/config/site'

export const metadata: Metadata = {
  title: 'Términos y condiciones',
  description: `Condiciones generales de uso y compra en ${SITE_NAME}.`,
}

const sectionTitle = 'text-base font-semibold tracking-[-0.02em] text-foreground'
const body = 'space-y-3 text-sm leading-relaxed text-muted-foreground'
const list = 'list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground'

export default function TerminosPage() {
  return (
    <main className="pb-20 lg:pb-0">
      <Container>
        <PageHeader
          title="Términos y condiciones"
          breadcrumb={[
            { label: 'Inicio', href: '/' },
            { label: 'Términos y condiciones' },
          ]}
        />

        <section className="brand-page pt-0">
          <div className="brand-panel-solid space-y-8 p-6 md:p-8">
            <p className="text-xs text-muted-foreground">
              Última actualización: mayo de 2026. Este texto es informativo; ante dudas puntuales
              podés contactarnos.
            </p>

            <div className={body}>
              <h2 className={sectionTitle}>Titular del sitio</h2>
              <p>
                El sitio web y la tienda online {SITE_NAME} son operados por el titular indicado en
                las facturas y comunicaciones de pedido. Para consultas generales:{' '}
                <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="text-primary hover:underline">
                  {SITE_CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Aceptación y alcance</h2>
              <p>
                Al navegar o comprar en este sitio aceptás estos términos y la política de
                privacidad. Si no estás de acuerdo, te pedimos que no utilices la tienda.
              </p>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Productos, precios y disponibilidad</h2>
              <ul className={list}>
                <li>
                  Las publicaciones describen productos, talles, colores y precios con la mayor
                  precisión posible. Pueden existir diferencias leves respecto al producto final por
                  pantalla, lote o confección.
                </li>
                <li>
                  Los precios se expresan en pesos argentinos (ARS) salvo indicación contraria y
                  pueden modificarse sin previo aviso. El precio aplicable es el que figura al
                  confirmar el pago según el flujo de checkout.
                </li>
                <li>
                  La disponibilidad es orientativa. Si un ítem no puede cumplirse, te contactaremos
                  para ofrecer sustituto, crédito o devolución del importe abonado.
                </li>
              </ul>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Pedidos y formación del contrato</h2>
              <ul className={list}>
                <li>
                  El pedido se considera aceptado cuando el pago es aprobado por el proveedor de
                  pagos y la orden queda registrada en nuestro sistema.
                </li>
                <li>
                  Debés completar datos veraces (contacto, entrega, facturación si corresponde).
                  Podemos cancelar operaciones con datos inconsistentes o indicios de fraude.
                </li>
                <li>
                  Los medios de pago habilitados (por ejemplo Mercado Pago) están sujetos a sus
                  propios términos y validaciones.
                </li>
              </ul>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Envíos</h2>
              <p>
                Los plazos y costos de envío se informan en el checkout o en la sección de ayuda.
                Los riesgos de pérdida o daño pasan según lo acordado con el transportista y la
                normativa aplicable al consumo.
              </p>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Propiedad intelectual</h2>
              <p>
                Marcas, textos, imágenes y diseño del sitio pertenecen a sus titulares o se usan con
                licencia. No está permitida la reproducción sin autorización.
              </p>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Limitación de responsabilidad</h2>
              <p>
                Ponemos medios razonables para que el sitio funcione de forma continua, pero no
                garantizamos ausencia de interrupciones o errores. No somos responsables por daños
                indirectos o lucro cesante salvo lo que la ley argentina no permita limitar.
              </p>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Ley aplicable y jurisdicción</h2>
              <p>
                Estos términos se rigen por las leyes de la República Argentina. Para consumidores
                encuadrados en la Ley de Defensa del Consumidor (24.240), serán competentes los
                tribunales del domicilio del consumidor cuando la ley así lo disponga.
              </p>
            </div>
          </div>
        </section>
      </Container>
    </main>
  )
}
