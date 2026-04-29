import Link from 'next/link'
import { Container } from '@/shared/ui/layout/container'

const QUICK_CATEGORIES = [
  { label: 'Remeras', href: '/productos?categoria=Remeras', note: 'Mas vendidas' },
  { label: 'Buzos', href: '/productos?categoria=Buzos', note: 'Ideal temporada' },
  { label: 'Accesorios', href: '/productos?categoria=Accesorios', note: 'Desde $24.900' },
  { label: 'Pantalones', href: '/productos?categoria=Pantalones', note: 'Nuevos ingresos' },
  { label: 'Sets', href: '/productos?categoria=Sets', note: 'Looks completos' },
  { label: 'Ofertas', href: '/productos?orden=precio_asc', note: 'Precio especial' },
] as const

export function CategoriesGrid() {
  return (
    <section className="border-t border-border bg-background py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="space-y-8 sm:space-y-10">
          <div className="max-w-3xl space-y-2">
            <p className="brand-kicker">Categorias</p>
            <h2 className="font-serif text-2xl font-normal text-foreground sm:text-3xl lg:text-4xl">
              Explora rapido por tipo de producto.
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-foreground/70 sm:text-base">
              Atajos de compra para encontrar lo que buscas en menos pasos.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_CATEGORIES.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group rounded-2xl border border-border/80 bg-surface px-5 py-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_12px_24px_rgba(26,26,26,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {item.note}
                </p>
                <p className="mt-2 text-lg font-medium tracking-[-0.02em] text-foreground">
                  {item.label}
                </p>
                <p className="mt-3 text-sm text-foreground/70">Ver categoria</p>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
