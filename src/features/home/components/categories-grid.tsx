import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { Container } from '@/components/shared/layout/container'

export function CategoriesGrid({ categories }: { categories: string[] }) {
  if (categories.length === 0) return null

  const CATEGORIES = categories.map((name, index) => ({
    name,
    slug: name.toLowerCase(),
    index,
  }))

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background border-t border-border">
      <Container>

        {/* Header de sección */}
        <div className="flex items-end justify-between mb-6 sm:mb-10">
          <div className="space-y-2">
            <p className="text-2xs font-medium tracking-[0.25em] uppercase text-muted-foreground">
              Explorar
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal font-serif">Por categoría</h2>
          </div>
          <Link
            href="/productos"
            className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Ver todo →
          </Link>
        </div>

        {/* Lista mobile */}
        <div className="sm:hidden border-y border-border/60">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/productos?category=${cat.slug}`}
              className="group flex items-center justify-between gap-4 py-4 border-b border-border last:border-b-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xs font-medium tracking-[0.25em] uppercase text-muted-foreground">
                  {String(cat.index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-medium font-serif leading-none text-foreground truncate">
                  {cat.name}
                </h3>
              </div>
              <span className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                Ver →
              </span>
            </Link>
          ))}
        </div>

        {/* Grid desktop/tablet */}
        <div
          className={cn(
            'hidden sm:grid lg:grid-cols-4 gap-3',
            CATEGORIES.length === 1
              ? 'sm:grid-cols-2 max-w-[32rem] mx-auto lg:max-w-none lg:mx-0'
              : 'sm:grid-cols-2',
          )}
        >
          {CATEGORIES.map((cat) => {
            const isDark = cat.index % 2 !== 0
            return (
              <Link
                key={cat.slug}
                href={`/productos?category=${cat.slug}`}
                className={cn(
                  'group relative aspect-[3/4] overflow-hidden flex flex-col justify-between p-6 lg:p-8',
                  'transition-colors duration-300',
                  isDark
                    ? 'bg-foreground hover:bg-foreground/90'
                    : 'bg-surface hover:bg-muted/60',
                )}
              >
                {/* Número de fondo — watermark tipográfico */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute bottom-4 right-3 font-light font-serif leading-none select-none pointer-events-none',
                    'text-watermark-sm sm:text-watermark-md lg:text-watermark-lg',
                    'transition-opacity duration-500',
                    isDark
                      ? 'text-background/[0.07] group-hover:text-background/[0.12]'
                      : 'text-foreground/[0.05] group-hover:text-foreground/[0.09]',
                  )}
                >
                  {String(cat.index + 1).padStart(2, '0')}
                </span>

                {/* Top: índice pequeño */}
                <p
                  className={cn(
                    'text-2xs font-medium tracking-[0.25em] uppercase',
                    isDark ? 'text-background/40' : 'text-muted-foreground',
                  )}
                >
                  — {String(cat.index + 1).padStart(2, '0')}
                </p>

                {/* Bottom: nombre de categoría */}
                <div className="space-y-3">
                  {/* Línea fucsia que se expande en hover */}
                  <span
                    className="block h-[2px] w-0 bg-primary group-hover:w-8 transition-[width] duration-500 ease-out"
                    aria-hidden="true"
                  />
                  <h3
                    className={cn(
                      'text-xl sm:text-2xl lg:text-3xl font-medium font-serif leading-tight',
                      isDark ? 'text-background' : 'text-foreground',
                    )}
                  >
                    {cat.name}
                  </h3>
                  {/* Flecha visible en hover */}
                  <p
                    className={cn(
                      'text-xs font-medium tracking-[0.15em] uppercase',
                      'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                      isDark ? 'text-background/60' : 'text-muted-foreground',
                    )}
                  >
                    Ver →
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

      </Container>
    </section>
  )
}
