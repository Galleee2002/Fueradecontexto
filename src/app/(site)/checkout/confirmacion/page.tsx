import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { SITE_CONTACT_EMAIL } from '@/shared/config/site'
import { Container } from '@/shared/ui/layout/container'

interface Props {
  searchParams: Promise<{
    orderId?: string
    email?: string
    external_reference?: string
    collection_status?: string
    payment_id?: string
  }>
}

export default async function ConfirmacionPage({ searchParams }: Props) {
  const params = await searchParams
  // MP sends external_reference = orderId; also support direct orderId param
  const orderId = params.external_reference ?? params.orderId

  return (
    <main className="brand-shell flex min-h-screen items-center py-20 sm:py-24">
      <Container>
        <div className="brand-panel-solid mx-auto max-w-2xl px-8 py-12 text-center sm:px-12">
          <CheckCircle
            className="mx-auto mb-8 h-16 w-16 text-foreground"
            strokeWidth={1.5}
          />

          <p className="brand-kicker mb-3">Pago confirmado</p>
          <h1 className="mb-4 font-serif text-3xl md:text-4xl">
            Tu pedido fue confirmado
          </h1>

          {orderId && (
            <p className="mb-2 text-muted-foreground">
              Número de orden:{' '}
              <span className="font-medium tracking-[0.22em] text-foreground">{orderId}</span>
            </p>
          )}

          {params.email && (
            <p className="mb-10 text-sm text-muted-foreground">
              Recibirás un email de confirmación en{' '}
              <span className="text-foreground">{params.email}</span>
            </p>
          )}

          {!params.email && (
            <p className="mb-10 text-sm text-muted-foreground">
              Pronto recibirás un email con los detalles de tu pedido.
            </p>
          )}

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/productos"
              className="brand-button-primary px-8"
            >
              Seguir comprando
            </Link>
          </div>

          <p className="mt-10 text-xs text-muted-foreground">
            ¿Tenés alguna consulta? Escribinos a{' '}
            <a
              href={`mailto:${SITE_CONTACT_EMAIL}`}
              className="underline underline-offset-2"
            >
              {SITE_CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </Container>
    </main>
  )
}
