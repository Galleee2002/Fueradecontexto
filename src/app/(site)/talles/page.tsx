import type { Metadata } from 'next'
import { Container } from '@/shared/ui/layout/container'
import { PageHeader } from '@/shared/ui/layout/page-header'
import { getProductCategories, getSizeGuides } from '@/features/products'

const PREFERRED_COLUMNS = [
  { label: 'Talle', aliases: ['talle', 'talla'] },
  { label: 'Ancho', aliases: ['ancho', 'pecho'] },
  { label: 'Largo', aliases: ['largo'] },
] as const

export const metadata: Metadata = {
  title: 'Guia de talles',
  description: 'Consulta la guia de talles por categoria para elegir la medida correcta.',
  alternates: { canonical: '/talles' },
}

const CATEGORIES_WITHOUT_SIZE_GUIDE = new Set(['gorras'])

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Number.isInteger(value) ? String(value) : String(value)
  }
  const s = String(value).trim()
  return s === '' ? '—' : s
}

export default async function TallesPage() {
  const [categoriesRaw, guides] = await Promise.all([getProductCategories(), getSizeGuides()])
  const categories = categoriesRaw.filter(
    (category) => !CATEGORIES_WITHOUT_SIZE_GUIDE.has(category.trim().toLowerCase()),
  )

  const guideByCategoryLower = new Map(
    guides.map((guide) => [guide.category.trim().toLowerCase(), guide]),
  )

  return (
    <main className="pb-20 lg:pb-0">
      <Container>
        <PageHeader
          title="Talles"
          breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Talles' }]}
        />

        <section className="py-10 md:py-14 space-y-6">
          <div className="grid gap-5 md:grid-cols-2 md:items-start">
            {categories.map((category) => {
              const guide = guideByCategoryLower.get(category.trim().toLowerCase())
              const rows = Array.isArray(guide?.rows) ? guide.rows : []
              const firstRow = rows[0]
              const columns = firstRow
                ? PREFERRED_COLUMNS.flatMap((column) => {
                    const key = Object.keys(firstRow).find((candidate) =>
                      (column.aliases as readonly string[]).includes(candidate.toLowerCase()),
                    )

                    return key ? [{ key, label: column.label }] : []
                  })
                : []

              return (
                <article
                  key={category}
                  className="min-w-0 flex flex-col rounded-xl border border-border bg-background p-5 md:p-6"
                >
                  <h3 className="text-lg font-serif text-foreground shrink-0">{category}</h3>

                  {!guide ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Todavía no hay tabla para esta categoría.
                    </p>
                  ) : rows.length === 0 ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Tabla cargada sin filas.
                    </p>
                  ) : (
                    <div className="mt-4 min-h-0 min-w-0 flex-1 overflow-x-auto overscroll-x-contain rounded-lg border border-border/60 bg-surface/30 [scrollbar-width:thin]">
                      <table className="w-full min-w-max border-collapse text-left text-sm">
                        <thead className="bg-surface/90">
                          <tr className="border-b border-border/80">
                            {columns.map((column) => (
                              <th
                                key={column.key}
                                scope="col"
                                className="whitespace-nowrap px-3 py-2.5 pr-5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground first:pl-4 last:pr-4 sm:first:pl-5 sm:last:pr-5"
                              >
                                {column.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row, index) => (
                            <tr
                              key={`${category}-${index}`}
                              className="border-b border-border/50 last:border-b-0 even:bg-background/40"
                            >
                              {columns.map((column) => (
                                <td
                                  key={column.key}
                                  className="whitespace-nowrap px-3 py-2.5 pr-5 text-foreground/90 first:pl-4 last:pr-4 sm:first:pl-5 sm:last:pr-5 [&:not(:first-child)]:tabular-nums"
                                >
                                  {formatCell(row[column.key])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </article>
              )
            })}
          </div>

          {categories.length === 0 && (
            <div className="rounded-xl border border-border bg-background p-5 text-sm text-muted-foreground">
              No hay categorias publicadas para mostrar por ahora.
            </div>
          )}
        </section>
      </Container>
    </main>
  )
}
