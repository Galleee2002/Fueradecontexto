import { Container } from '@/shared/ui/layout/container'

export function CategoriesGrid() {
  return (
    <section className="border-t border-border bg-background py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="max-w-3xl space-y-6">
          <p className="text-2xs font-medium tracking-[0.28em] uppercase text-muted-foreground">
            Categorias
          </p>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-normal text-foreground sm:text-3xl lg:text-4xl">
              Estamos preparando una nueva forma de explorar las categorías.
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-foreground/70 sm:text-base">
              Esta sección va a seguir en la home, pero el diseño editorial anterior ya fue retirado para dar lugar a una versión nueva.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {['Accesorios', 'Indumentaria', 'Destacados'].map((label) => (
              <div
                key={label}
                className="border border-border bg-surface px-4 py-5 text-sm text-foreground/80"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
