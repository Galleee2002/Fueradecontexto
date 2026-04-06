import { sql } from '@/lib/db/client'
import { CategoriesManager } from '@/features/admin/components/categories-manager'
import { Container } from '@/components/shared/layout/container'

async function fetchCategoriesWithCount() {
  const rows = await sql`
    SELECT c.name, c.subcategories, COUNT(p.id)::int AS count
    FROM "Category" c
    LEFT JOIN "Product" p ON p.category = c.name
    GROUP BY c.name, c.subcategories
    ORDER BY c.name ASC
  `
  return rows as { name: string; subcategories: string[]; count: number }[]
}

export default async function AdminCategoriasPage() {
  const categories = await fetchCategoriesWithCount()

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Categorías</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Administrá las categorías de productos de la tienda.
        </p>
      </div>
      <CategoriesManager categories={categories} />
    </div>
  )
}
