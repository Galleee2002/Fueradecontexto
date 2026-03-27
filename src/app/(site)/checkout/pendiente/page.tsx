import Link from 'next/link'
import { Clock } from 'lucide-react'
import { Container } from '@/components/shared/layout/container'

interface Props {
  searchParams: Promise<{ external_reference?: string }>
}

export default async function PendientePage({ searchParams }: Props) {
  const { external_reference: orderId } = await searchParams

  return (
    <main className="min-h-screen flex items-center py-24">
      <Container>
        <div className="max-w-md mx-auto text-center">
          <Clock
            className="w-16 h-16 mx-auto mb-8 text-muted-foreground"
            strokeWidth={1.5}
          />

          <h1 className="font-serif text-3xl md:text-4xl mb-4">
            Pago en proceso
          </h1>

          <p className="text-muted-foreground mb-4">
            Tu pago está siendo procesado. Te notificaremos por email cuando se confirme.
          </p>

          {orderId && (
            <p className="text-muted-foreground text-sm mb-10">
              Número de orden:{' '}
              <span className="text-foreground font-medium tracking-widest">{orderId}</span>
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/productos"
              className="bg-foreground text-primary-foreground hover:bg-primary px-8 py-4 text-xs font-medium tracking-widest uppercase rounded-none transition-colors"
            >
              Seguir comprando
            </Link>
          </div>

          <p className="mt-10 text-xs text-muted-foreground">
            ¿Tenés dudas? Escribinos a{' '}
            <span className="underline underline-offset-2">hola@fueradecontexto.com</span>
          </p>
        </div>
      </Container>
    </main>
  )
}
