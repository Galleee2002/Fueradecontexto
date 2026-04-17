'use server'

import { revalidatePath } from 'next/cache'
import { sql } from '@/shared/infrastructure/db/client'
import { assertAdminSession } from '@/shared/infrastructure/auth/require-admin'
import { ensureOrderColumnSupport } from '@/shared/infrastructure/db/order-column-support'
import { syncOrderTracking } from '@/features/checkout/application/sync-order-shipping'

export async function deleteAdminOrder(id: string) {
  await assertAdminSession()
  await ensureOrderColumnSupport()

  await sql`
    UPDATE "Order"
    SET "deletedAt" = NOW(), "updatedAt" = NOW()
    WHERE id = ${id}
  `

  revalidatePath('/admin/ordenes')
  revalidatePath('/cuenta')
  return { success: true }
}

export async function deleteAdminClientOrders(customerEmail: string) {
  await assertAdminSession()
  await ensureOrderColumnSupport()

  await sql`
    UPDATE "Order"
    SET "deletedAt" = NOW(), "updatedAt" = NOW()
    WHERE "customerEmail" = ${customerEmail}
      AND "deletedAt" IS NULL
  `

  revalidatePath('/admin/clientes')
  revalidatePath('/admin/ordenes')
  revalidatePath('/cuenta')
  return { success: true }
}

export async function syncAdminOrderTracking(id: string) {
  await assertAdminSession()
  const result = await syncOrderTracking(id)

  revalidatePath('/admin/ordenes')
  revalidatePath('/cuenta')

  return result
}
