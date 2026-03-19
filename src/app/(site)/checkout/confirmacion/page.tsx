import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Container } from '@/components/shared/layout/container'

interface Props {
  searchParams: Promise<{ orderId?: string; email?: string }>
}

export default async function ConfirmacionPage({ searchParams }: Props) {
  const { orderId, email } = await searchParams

  return (
    <main className="min-h-screen flex items-center py-24">
      <Container>
        <div className="max-w-md mx-auto text-center">
          <CheckCircle
            className="w-16 h-16 mx-auto mb-8 text-foreground"
            strokeWidth={1.5}
          />

          <h1 className="font-serif text-3xl md:text-4xl mb-4">
            Tu pedido fue confirmado
          </h1>

          {orderId && (
            <p className="text-muted-foreground mb-2">
              Número de orden:{' '}
              <span className="text-foreground font-medium tracking-widest">{orderId}</span>
            </p>
          )}

          {email && (
            <p className="text-muted-foreground text-sm mb-10">
              Recibirás un email de confirmación en{' '}
              <span className="text-foreground">{email}</span>
            </p>
          )}

          {!email && !orderId && (
            <p className="text-muted-foreground text-sm mb-10">
              Pronto recibirás un email con los detalles de tu pedido.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/productos"
              className="bg-foreground text-white hover:bg-primary px-8 py-4 text-xs font-medium tracking-widest uppercase rounded-none transition-colors"
            >
              Seguir comprando
            </Link>
          </div>

          <p className="mt-10 text-xs text-muted-foreground">
            ¿Tenés alguna consulta? Escribinos a{' '}
            <span className="underline underline-offset-2">hola@fueradecontexto.com</span>
          </p>
        </div>
      </Container>
    </main>
  )
}
