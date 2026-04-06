import { sql } from '@/lib/db/client'
import type { AdminProduct, AdminStats, AdminProductStatus, AdminOrder, AdminClient } from '../types'
import type { SizeGuide } from '@/features/products/types'

const ADMIN_PAGE_SIZE = 20

export async function fetchAdminProducts(
  search?: string,
  category?: string,
  status: AdminProductStatus = 'all',
  page = 1,
): Promise<{ products: AdminProduct[]; total: number; totalPages: number }> {
  const offset = (page - 1) * ADMIN_PAGE_SIZE

  const statusFilter =
    status === 'active'
      ? sql`AND active = true`
      : status === 'inactive'
        ? sql`AND active = false`
        : sql``

  const rows = await sql`
      SELECT p.id, p.slug, p.name, p.description, p.price::float, p."imageUrl",
        COALESCE(to_jsonb(p) -> 'previewImages', to_jsonb(p) -> 'preview_images', '[]'::jsonb) AS "previewImages",
        p.category, p.subcategory, p.active, p."createdAt", p."updatedAt",
        p."availableColors", p."availableSizes", p."stampSizes", p."stampLocations"
      FROM "Product" p
      WHERE p."deletedAt" IS NULL
    ${search ? sql`AND name ILIKE ${'%' + search + '%'}` : sql``}
    ${category ? sql`AND category = ${category}` : sql``}
    ${statusFilter}
      ORDER BY p."createdAt" DESC
    LIMIT ${ADMIN_PAGE_SIZE} OFFSET ${offset}
  `

  const countRows = await sql`
    SELECT COUNT(*)::int AS total
    FROM "Product"
    WHERE "deletedAt" IS NULL
    ${search ? sql`AND name ILIKE ${'%' + search + '%'}` : sql``}
    ${category ? sql`AND category = ${category}` : sql``}
    ${statusFilter}
  `

  const total = (countRows[0] as { total: number }).total
  const totalPages = Math.ceil(total / ADMIN_PAGE_SIZE)

  return { products: rows as AdminProduct[], total, totalPages }
}

export async function fetchAdminProductById(id: string): Promise<AdminProduct | null> {
  const rows = await sql`
    SELECT p.id, p.slug, p.name, p.description, p.price::float, p."imageUrl",
           COALESCE(to_jsonb(p) -> 'previewImages', to_jsonb(p) -> 'preview_images', '[]'::jsonb) AS "previewImages",
           p.category, p.subcategory, p.active, p."createdAt", p."updatedAt",
           p."availableColors", p."availableSizes", p."stampSizes", p."stampLocations"
    FROM "Product" p
    WHERE p.id = ${id} AND p."deletedAt" IS NULL
    LIMIT 1
  `
  return (rows[0] as AdminProduct) ?? null
}

export async function fetchSizeGuides(): Promise<SizeGuide[]> {
  const rows = await sql`
    SELECT id, category, rows, "createdAt", "updatedAt"
    FROM "SizeGuide"
    ORDER BY category
  `
  return rows as SizeGuide[]
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const rows = await sql`
    SELECT
      COUNT(*)::int AS total,
      SUM(CASE WHEN active = true THEN 1 ELSE 0 END)::int AS active,
      SUM(CASE WHEN active = false THEN 1 ELSE 0 END)::int AS inactive,
      COUNT(DISTINCT category)::int AS categories
    FROM "Product"
    WHERE "deletedAt" IS NULL
  `
  const r = rows[0] as { total: number; active: number; inactive: number; categories: number }
  return {
    totalProducts: r.total ?? 0,
    activeProducts: r.active ?? 0,
    inactiveProducts: r.inactive ?? 0,
    totalCategories: r.categories ?? 0,
  }
}

export async function fetchAdminCategories(): Promise<{ name: string; subcategories: string[] }[]> {
  const rows = await sql`
    SELECT name, subcategories FROM "Category" ORDER BY name
  `
  return rows.map((r) => ({
    name: (r as { name: string; subcategories: string[] }).name,
    subcategories: ((r as { name: string; subcategories: string[] }).subcategories) ?? [],
  }))
}

export async function fetchAdminStampLocations(): Promise<string[]> {
  const rows = await sql`
    SELECT name FROM "StampLocation" ORDER BY "createdAt" ASC
  `
  return rows.map((r) => (r as { name: string }).name)
}

export async function fetchAdminColors(): Promise<{ id: string; name: string; hex: string }[]> {
  const rows = await sql`
    SELECT id, name, hex FROM "Color" ORDER BY name ASC
  `
  return rows as { id: string; name: string; hex: string }[]
}

export async function fetchAdminOrders(
  page = 1,
): Promise<{ orders: AdminOrder[]; total: number; totalPages: number }> {
  const offset = (page - 1) * ADMIN_PAGE_SIZE

  const rows = await sql`
    SELECT o.id, o."customerEmail", o."customerName", o.total::float,
           o.status, o."createdAt", COUNT(oi.id)::int AS "itemCount"
    FROM "Order" o
    LEFT JOIN "OrderItem" oi ON oi."orderId" = o.id
    GROUP BY o.id
    ORDER BY o."createdAt" DESC
    LIMIT ${ADMIN_PAGE_SIZE} OFFSET ${offset}
  `

  const countRows = await sql`SELECT COUNT(*)::int AS total FROM "Order"`
  const total = (countRows[0] as { total: number }).total
  const totalPages = Math.ceil(total / ADMIN_PAGE_SIZE)

  return { orders: rows as AdminOrder[], total, totalPages }
}

export async function fetchAdminClients(): Promise<AdminClient[]> {
  const rows = await sql`
    SELECT "customerEmail",
           (ARRAY_AGG("customerName" ORDER BY "createdAt" DESC))[1] AS "customerName",
           COUNT(*)::int AS "totalOrders",
           SUM(total)::float AS "totalSpent",
           MAX("createdAt") AS "lastOrderAt"
    FROM "Order"
    GROUP BY "customerEmail"
    ORDER BY MAX("createdAt") DESC
  `
  return rows as AdminClient[]
}
