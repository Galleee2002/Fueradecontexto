import Link from 'next/link'
import { Container } from '@/components/shared/layout/container'
import { PageHeader } from '@/components/shared/layout/page-header'
import { fetchProductCategories, fetchSizeGuides } from '@/features/products/queries/product-queries'

export default async function TallesPage() {
  const [categories, guides] = await Promise.all([fetchProductCategories(), fetchSizeGuides()])

  const guideByCategory = new Map(guides.map((guide) => [guide.category, guide]))

  return (
    <main className="pb-20 lg:pb-0">
      <Container>
        <PageHeader
          title="Talles"
          breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Talles' }]}
        />

        <section className="py-10 md:py-14 space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-serif text-foreground">Guia de talles por categoria</h2>
            <p className="mt-4 max-w-3xl text-muted-foreground leading-relaxed">
              Esta vista es temporal. Las tablas se administran desde panel y cada prenda consume la
              guia de su categoria dentro de la ficha de producto.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Gestion de tablas:{' '}
              <Link href="/admin/guia-talles" className="text-foreground underline underline-offset-4">
                /admin/guia-talles
              </Link>
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {categories.map((category) => {
              const guide = guideByCategory.get(category)
              const previewRows = Array.isArray(guide?.rows) ? guide.rows.slice(0, 3) : []
              const firstRow = previewRows[0]
              const columns = firstRow ? Object.keys(firstRow) : []

              return (
                <article key={category} className="rounded-xl border border-border bg-background p-5">
                  <h3 className="text-lg font-serif text-foreground">{category}</h3>

                  {!guide ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Todavia no hay tabla para esta categoria. Se cargara desde admin.
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
                              <th key={column} className="py-2 pr-4 font-medium text-muted-foreground uppercase text-xs tracking-wide">
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewRows.map((row, index) => (
                            <tr key={`${category}-${index}`} className="border-b border-border/60 last:border-b-0">
                              {columns.map((column) => (
                                <td key={column} className="py-2 pr-4 text-foreground/90">
                                  {String(row[column] ?? '-')}
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
