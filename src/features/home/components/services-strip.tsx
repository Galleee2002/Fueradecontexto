import { Truck, Tag, CreditCard } from 'lucide-react'
import { Container } from '@/components/shared/layout/container'

const SERVICES = [
  {
    icon: Truck,
    title: 'Envío a todo el país',
    description: 'Gratis en compras mayores a $50.000. Recibí en 24–72 h.',
  },
  {
    icon: Tag,
    title: 'Descuentos exclusivos',
    description: 'Hasta 30% off en selección de temporada para suscriptores.',
  },
  {
    icon: CreditCard,
    title: 'Hasta 12 cuotas',
    description: 'Sin interés con todas las tarjetas de crédito principales.',
  },
] as const

export function ServicesStrip() {
  return (
    <section className="bg-foreground border-t border-border/20">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/15">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="flex flex-col gap-3 sm:gap-4 py-6 sm:py-10 px-0 sm:px-10 sm:first:pl-0 sm:last:pr-0"
            >
              <service.icon
                className="h-5 w-5 text-background/50 stroke-[1.5]"
                aria-hidden="true"
              />
              <div className="space-y-1 sm:space-y-2">
                <h3 className="text-xs sm:text-sm font-medium tracking-wide text-background">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-background/50 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
