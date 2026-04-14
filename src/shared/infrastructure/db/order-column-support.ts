import { sql } from './client'

type OrderColumnSupport = {
  hasDeletedAt: boolean
}

let orderColumnSupportPromise: Promise<OrderColumnSupport> | null = null

async function loadOrderColumnSupport(): Promise<OrderColumnSupport> {
  const rows = (await sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Order'
      AND column_name IN ('deletedAt')
  `) as Array<{ column_name: string }>

  const columns = new Set(rows.map((row) => row.column_name))

  return {
    hasDeletedAt: columns.has('deletedAt'),
  }
}

async function loadCachedOrderColumnSupport() {
  if (orderColumnSupportPromise) return orderColumnSupportPromise

  orderColumnSupportPromise = loadOrderColumnSupport().catch((error) => {
    orderColumnSupportPromise = null
    throw error
  })

  return orderColumnSupportPromise
}

async function refreshOrderColumnSupport() {
  orderColumnSupportPromise = null
  return loadCachedOrderColumnSupport()
}

export async function ensureOrderColumnSupport(): Promise<OrderColumnSupport> {
  const support = await loadCachedOrderColumnSupport()

  if (!support.hasDeletedAt) {
    await sql`
      ALTER TABLE "Order"
      ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3)
    `
  }

  return support.hasDeletedAt ? support : refreshOrderColumnSupport()
}
