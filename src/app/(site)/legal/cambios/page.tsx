import type { Metadata } from 'next'
import { Container } from '@/shared/ui/layout/container'
import { PageHeader } from '@/shared/ui/layout/page-header'
import { SITE_CONTACT_EMAIL, SITE_NAME } from '@/shared/config/site'

export const metadata: Metadata = {
  title: 'Cambios y devoluciones',
  description: `Política de cambios, devoluciones y arrepentimiento en compras online en ${SITE_NAME}.`,
  alternates: { canonical: '/legal/cambios' },
  openGraph: {
    title: 'Cambios y devoluciones',
    description: `Política de cambios, devoluciones y arrepentimiento en compras online en ${SITE_NAME}.`,
    url: '/legal/cambios',
  },
}

const sectionTitle = 'text-base font-semibold tracking-[-0.02em] text-foreground'
const body = 'space-y-3 text-sm leading-relaxed text-muted-foreground'
const list = 'list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground'

export default function CambiosPage() {
  return (
    <main className="pb-20 lg:pb-0">
      <Container>
        <PageHeader
          title="Cambios y devoluciones"
          breadcrumb={[
            { label: 'Inicio', href: '/' },
            { label: 'Cambios y devoluciones' },
          ]}
        />

        <section className="brand-page pt-0">
          <div className="brand-panel-solid space-y-8 p-6 md:p-8">
            <p className="text-xs text-muted-foreground">
              Última actualización: mayo de 2026. Comprás a distancia con derechos previstos en la
              Ley de Defensa del Consumidor 24.240. Ante cualquier duda, escribinos antes de enviar
              un paquete.
            </p>

            <div className={body}>
              <h2 className={sectionTitle}>Contacto</h2>
              <p>
                Para iniciar un cambio o devolución:{' '}
                <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="text-primary hover:underline">
                  {SITE_CONTACT_EMAIL}
                </a>
                . Indicá número de pedido, motivo y fotos si el producto llegó dañado o equivocado.
              </p>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Derecho de arrepentimiento (compra a distancia)</h2>
              <ul className={list}>
                <li>
                  En compras a distancia, la Ley 24.240 reconoce un plazo de diez (10) días corridos
                  desde que recibís el producto o desde que queda acreditado el pago y estás en
                  condiciones de disponer del bien, según corresponda al caso.
                </li>
                <li>
                  El producto debe devolverse sin uso, con etiquetas y empaque original cuando sea
                  razonablemente posible. Si el arrepentimiento procede, podemos reintegrar el importe
                  conforme al mismo medio de pago o alternativa acordada.
                </li>
                <li>
                  Los costos de devolución pueden estar a tu cargo salvo que el producto sea defectuoso,
                  no corresponda al pedido o la ley disponga lo contrario en tu situación concreta.
                  Te informaremos el procedimiento antes de que envíes el retorno.
                </li>
              </ul>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Cambios por talle o preferencia</h2>
              <p>
                Aceptamos cambios por talle u otra variante según stock, si la prenda está sin uso,
                sin olores ni manchas, con etiquetas y en condiciones de reventa. El plazo y la
                logística se coordinan por correo; puede aplicarse diferencia de precio según valores
                vigentes al momento del cambio.
              </p>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Producto defectuoso o pedido equivocado</h2>
              <ul className={list}>
                <li>
                  Si el artículo tiene fallas de fabricación, llega dañado o no coincide con lo
                  comprado, contactanos dentro de los primeros días posteriores a la entrega con
                  evidencia fotográfica.
                </li>
                <li>
                  Ofreceremos reparación, sustitución, nota de crédito o reembolso según el caso y la
                  normativa aplicable. Los costos de retorno y reenvío corren por nuestra cuenta
                  cuando corresponda por error o vicio.
                </li>
              </ul>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Exclusiones habituales</h2>
              <ul className={list}>
                <li>Prendas usadas, lavadas o sin etiquetas, salvo vicios ocultos.</li>
                <li>Artículos personalizados o hechos a medida, cuando la ley lo permita.</li>
                <li>
                  Daños por mal uso, desgaste normal o manipulación ajena a lo razonable para probar
                  el producto.
                </li>
              </ul>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Garantía legal</h2>
              <p>
                Los bienes de consumo pueden tener garantía legal mínima según la Ley 24.240 y plazos
                según el tipo de producto. La garantía no cubre mal uso ni desgaste natural. Para
                reclamos, usá el mismo canal:{' '}
                <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="text-primary hover:underline">
                  {SITE_CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Defensa del consumidor</h2>
              <p>
                Podés acudir a los organismos de defensa del consumidor de tu jurisdicción. En{' '}
                {SITE_NAME} buscamos resolver cada caso de buena fe y con plazos razonables.
              </p>
            </div>
          </div>
        </section>
      </Container>
    </main>
  )
}
