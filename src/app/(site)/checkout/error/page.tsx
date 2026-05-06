import Link from 'next/link'
import { XCircle } from 'lucide-react'
import { SITE_CONTACT_EMAIL } from '@/shared/config/site'
import { Container } from '@/shared/ui/layout/container'

export default function ErrorPagoPage() {
  return (
    <main className="brand-shell flex min-h-screen items-center py-20 sm:py-24">
      <Container>
        <div className="brand-panel-solid mx-auto max-w-2xl px-8 py-12 text-center sm:px-12">
          <XCircle
            className="mx-auto mb-8 h-16 w-16 text-error"
            strokeWidth={1.5}
          />

          <p className="brand-kicker mb-3">Pago rechazado</p>
          <h1 className="mb-4 font-serif text-3xl md:text-4xl">
            El pago no pudo procesarse
          </h1>

          <p className="mb-10 text-muted-foreground">
            Tu pago fue rechazado. Podés intentarlo nuevamente con otro medio de pago.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/carrito"
              className="brand-button-primary px-8"
            >
              Volver al carrito
            </Link>
            <Link
              href="/productos"
              className="brand-button-secondary px-8"
            >
              Seguir comprando
            </Link>
          </div>

          <p className="mt-10 text-xs text-muted-foreground">
            ¿Tenés problemas? Escribinos a{' '}
            <span className="underline underline-offset-2">{SITE_CONTACT_EMAIL}</span>
          </p>
        </div>
      </Container>
    </main>
  )
}
