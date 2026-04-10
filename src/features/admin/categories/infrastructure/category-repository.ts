import { sql } from '@/shared/infrastructure/db/client'

export interface AdminCategoryWithCount {
  name: string
  subcategories: string[]
  count: number
}

export async function findAdminCategoriesWithCount() {
  const rows = await sql`
    SELECT c.name, c.subcategories, COUNT(p.id)::int AS count
    FROM "Category" c
    LEFT JOIN "Product" p ON p.category = c.name
    GROUP BY c.name, c.subcategories
    ORDER BY c.name ASC
  `

  return rows as AdminCategoryWithCount[]
}
