import { sql } from '@/shared/infrastructure/db/client'
import { ensureOrderColumnSupport } from '@/shared/infrastructure/db/order-column-support'
import type { OrderStatus } from '@/shared/config/orders'

export interface UserOrder {
  id: string
  total: number
  status: OrderStatus
  createdAt: Date
  itemCount: number
}

export async function fetchUserOrders(userId: string): Promise<UserOrder[]> {
  await ensureOrderColumnSupport()

  const rows = await sql`
    SELECT o.id, o.total::float, o.status, o."createdAt",
           COUNT(oi.id)::int AS "itemCount"
    FROM "Order" o
    LEFT JOIN "OrderItem" oi ON oi."orderId" = o.id
    WHERE o."userId" = ${userId} AND o."deletedAt" IS NULL
    GROUP BY o.id
    ORDER BY o."createdAt" DESC
    LIMIT 50
  `
  return rows as UserOrder[]
}
