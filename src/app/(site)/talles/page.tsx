import type { Metadata } from 'next'
import Link from 'next/link'
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

export default async function TallesPage() {
  const [categoriesRaw, guides] = await Promise.all([getProductCategories(), getSizeGuides()])
  const categories = categoriesRaw.filter(
    (category) => !CATEGORIES_WITHOUT_SIZE_GUIDE.has(category.trim().toLowerCase()),
  )

  const guideByCategory = new Map(guides.map((guide) => [guide.category, guide]))

  return (
    <main className="pb-20 lg:pb-0">
      <Container>
        <PageHeader
          title="Talles"
          breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Talles' }]}
        />

        <section className="py-10 md:py-14 space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            {categories.map((category) => {
              const guide = guideByCategory.get(category)
              const previewRows = Array.isArray(guide?.rows) ? guide.rows.slice(0, 3) : []
              const firstRow = previewRows[0]
              const columns = firstRow
                ? PREFERRED_COLUMNS.flatMap((column) => {
                    const key = Object.keys(firstRow).find((candidate) =>
                      (column.aliases as readonly string[]).includes(candidate.toLowerCase()),
                    )

                    return key ? [{ key, label: column.label }] : []
                  })
                : []

              return (
                <article key={category} className="rounded-xl border border-border bg-background p-5">
                  <h3 className="text-lg font-serif text-foreground">{category}</h3>

                  {!guide ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Todavía no hay tabla para esta categoría.
                    </p>
                  ) : previewRows.length === 0 ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Tabla cargada sin filas de ejemplo.
                    </p>
                  ) : (
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-border">
                            {columns.map((column) => (
                              <th key={column.key} className="py-2 pr-4 font-medium text-muted-foreground uppercase text-xs tracking-wide">
                                {column.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewRows.map((row, index) => (
                            <tr key={`${category}-${index}`} className="border-b border-border/60 last:border-b-0">
                              {columns.map((column) => (
                                <td key={column.key} className="py-2 pr-4 text-foreground/90">
                                  {String(row[column.key] ?? '-')}
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
