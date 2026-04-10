import { sql } from '@/shared/infrastructure/db/client'
import type { OrderStatus } from '@/shared/config/orders'

export interface UserOrder {
  id: string
  total: number
  status: OrderStatus
  createdAt: Date
  itemCount: number
}

export async function fetchUserOrders(userId: string): Promise<UserOrder[]> {
  const rows = await sql`
    SELECT o.id, o.total::float, o.status, o."createdAt",
           COUNT(oi.id)::int AS "itemCount"
    FROM "Order" o
    LEFT JOIN "OrderItem" oi ON oi."orderId" = o.id
    WHERE o."userId" = ${userId}
    GROUP BY o.id
    ORDER BY o."createdAt" DESC
    LIMIT 50
  `
  return rows as UserOrder[]
}
