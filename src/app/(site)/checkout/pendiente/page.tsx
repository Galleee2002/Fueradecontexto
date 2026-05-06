import Link from 'next/link'
import { Clock } from 'lucide-react'
import { SITE_CONTACT_EMAIL } from '@/shared/config/site'
import { Container } from '@/shared/ui/layout/container'

interface Props {
  searchParams: Promise<{ external_reference?: string }>
}

export default async function PendientePage({ searchParams }: Props) {
  const { external_reference: orderId } = await searchParams

  return (
    <main className="brand-shell flex min-h-screen items-center py-20 sm:py-24">
      <Container>
        <div className="brand-panel-solid mx-auto max-w-2xl px-8 py-12 text-center sm:px-12">
          <Clock
            className="mx-auto mb-8 h-16 w-16 text-muted-foreground"
            strokeWidth={1.5}
          />

          <p className="brand-kicker mb-3">Pago en revisión</p>
          <h1 className="mb-4 font-serif text-3xl md:text-4xl">
            Pago en proceso
          </h1>

          <p className="mb-4 text-muted-foreground">
            Tu pago está siendo procesado. Te notificaremos por email cuando se confirme.
          </p>

          {orderId && (
            <p className="mb-10 text-sm text-muted-foreground">
              Número de orden:{' '}
              <span className="font-medium tracking-[0.22em] text-foreground">{orderId}</span>
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
            ¿Tenés dudas? Escribinos a{' '}
            <span className="underline underline-offset-2">{SITE_CONTACT_EMAIL}</span>
          </p>
        </div>
      </Container>
    </main>
  )
}
