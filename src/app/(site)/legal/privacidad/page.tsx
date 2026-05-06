import type { Metadata } from 'next'
import { Container } from '@/shared/ui/layout/container'
import { PageHeader } from '@/shared/ui/layout/page-header'
import { SITE_CONTACT_EMAIL, SITE_NAME } from '@/shared/config/site'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description: `Cómo ${SITE_NAME} trata tus datos personales conforme a la normativa argentina.`,
  alternates: { canonical: '/legal/privacidad' },
  openGraph: {
    title: 'Política de privacidad',
    description: `Cómo ${SITE_NAME} trata tus datos personales conforme a la normativa argentina.`,
    url: '/legal/privacidad',
  },
}

const sectionTitle = 'text-base font-semibold tracking-[-0.02em] text-foreground'
const body = 'space-y-3 text-sm leading-relaxed text-muted-foreground'
const list = 'list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground'

export default function PrivacidadPage() {
  return (
    <main className="pb-20 lg:pb-0">
      <Container>
        <PageHeader
          title="Política de privacidad"
          breadcrumb={[
            { label: 'Inicio', href: '/' },
            { label: 'Política de privacidad' },
          ]}
        />

        <section className="brand-page pt-0">
          <div className="brand-panel-solid space-y-8 p-6 md:p-8">
            <p className="text-xs text-muted-foreground">
              Última actualización: mayo de 2026. Tratamos datos personales de acuerdo con la Ley
              25.326 de Protección de Datos Personales de Argentina y normas complementarias.
            </p>

            <div className={body}>
              <h2 className={sectionTitle}>Responsable del tratamiento</h2>
              <p>
                {SITE_NAME}. Consultas sobre privacidad:{' '}
                <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="text-primary hover:underline">
                  {SITE_CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Datos que podemos recopilar</h2>
              <ul className={list}>
                <li>Identificación y contacto: nombre, correo, teléfono, domicilio de entrega.</li>
                <li>
                  Datos de compra: productos, montos, historial de pedidos e identificadores de
                  transacción.
                </li>
                <li>
                  Datos de cuenta o checkout que nos permitas cargar voluntariamente.
                </li>
              </ul>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Finalidades</h2>
              <ul className={list}>
                <li>Procesar pedidos, pagos, facturación y envíos.</li>
                <li>Atender consultas, reclamos y postventa.</li>
                <li>Mejorar el servicio, seguridad y prevención de fraude.</li>
                <li>
                  Envío de novedades o promociones solo si nos diste consentimiento o la ley lo
                  permite.
                </li>
              </ul>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Base legal y conservación</h2>
              <p>
                Tratamos datos para ejecutar el contrato de compra, cumplir obligaciones legales
                (contabilidad, fiscalidad) y, en su caso, el interés legítimo de seguridad del sitio.
                Conservamos la información el tiempo necesario para esas finalidades y plazos legales.
              </p>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Terceros y pagos</h2>
              <p>
                Los pagos pueden procesarse a través de proveedores como Mercado Pago. Esos
                proveedores tratan datos según sus propias políticas. También podemos compartir datos
                con empresas de logística para entregar tu pedido. No vendemos tus datos a terceros
                para su marketing.
              </p>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Seguridad</h2>
              <p>
                Aplicamos medidas técnicas y organizativas razonables para proteger la
                información. Ningún sistema es absolutamente invulnerable; si detectás un problema,
                escribinos de inmediato.
              </p>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Tus derechos</h2>
              <p className="mb-2">
                Podés solicitar acceso, rectificación o actualización de tus datos, y en los casos
                previstos por ley la supresión o la limitación del tratamiento. Para ejercerlos,
                contactanos en:
              </p>
              <p>
                <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="text-primary hover:underline">
                  {SITE_CONTACT_EMAIL}
                </a>
              </p>
              <p className="pt-2">
                También podés presentar una consulta o reclamo ante la Dirección Nacional de
                Protección de Datos Personales cuando corresponda.
              </p>
            </div>

            <div className={body}>
              <h2 className={sectionTitle}>Cookies y tecnologías similares</h2>
              <p>
                El sitio puede usar cookies o almacenamiento local necesario para el funcionamiento
                (por ejemplo sesión o preferencias). Si incorporamos analítica o marketing con
                cookies no esenciales, lo indicaremos y, cuando la normativa lo exija, pediremos tu
                consentimiento.
              </p>
            </div>
          </div>
        </section>
      </Container>
    </main>
  )
}
