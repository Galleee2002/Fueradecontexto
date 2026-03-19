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
    <section className="py-16 lg:py-20 bg-background border-t border-border">
      <Container>

        {/* Header de sección */}
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-2">
            <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-muted-foreground">
              Explorar
            </p>
            <h2 className="text-4xl font-normal font-serif">Por categoría</h2>
          </div>
          <Link
            href="/productos"
            className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Ver todo →
          </Link>
        </div>

        {/* Grid de categorías — 2 col mobile, 4 col desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
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
                    'text-[100px] lg:text-[130px]',
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
                    'text-[10px] font-medium tracking-[0.25em] uppercase',
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
                      'text-2xl lg:text-3xl font-medium font-serif leading-tight',
                      isDark ? 'text-background' : 'text-foreground',
                    )}
                  >
                    {cat.name}
                  </h3>
                  {/* Flecha visible en hover */}
                  <p
                    className={cn(
                      'text-[11px] font-medium tracking-[0.15em] uppercase',
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
