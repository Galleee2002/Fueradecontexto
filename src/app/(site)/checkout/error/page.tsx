import Link from 'next/link'
import { XCircle } from 'lucide-react'
import { Container } from '@/components/shared/layout/container'

export default function ErrorPagoPage() {
  return (
    <main className="min-h-screen flex items-center py-24">
      <Container>
        <div className="max-w-md mx-auto text-center">
          <XCircle
            className="w-16 h-16 mx-auto mb-8 text-error"
            strokeWidth={1.5}
          />

          <h1 className="font-serif text-3xl md:text-4xl mb-4">
            El pago no pudo procesarse
          </h1>

          <p className="text-muted-foreground mb-10">
            Tu pago fue rechazado. Podés intentarlo nuevamente con otro medio de pago.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/carrito"
              className="bg-foreground text-primary-foreground hover:bg-primary px-8 py-4 text-xs font-medium tracking-widest uppercase rounded-none transition-colors"
            >
              Volver al carrito
            </Link>
            <Link
              href="/productos"
              className="border border-border px-8 py-4 text-xs font-medium tracking-widest uppercase rounded-none hover:bg-surface transition-colors"
            >
              Seguir comprando
            </Link>
          </div>

          <p className="mt-10 text-xs text-muted-foreground">
            ¿Tenés problemas? Escribinos a{' '}
            <span className="underline underline-offset-2">hola@fueradecontexto.com</span>
          </p>
        </div>
      </Container>
    </main>
  )
}
