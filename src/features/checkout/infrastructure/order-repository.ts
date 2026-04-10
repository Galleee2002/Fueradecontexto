import { prisma } from '@/shared/infrastructure/db/prisma'
import { sql } from '@/shared/infrastructure/db/client'
import type { ContactData, ShippingData } from '../types'
import type { OrderStatus } from '@/shared/config/orders'

export interface CheckoutProductRow {
  id: string
  price: number
  name: string
  stock: number
}

interface CreateOrderInput {
  contact: ContactData
  shipping: ShippingData
  items: { productId: string; quantity: number; unitPrice: number }[]
  total: number
  userId: string | null
  status: OrderStatus
}

export async function findActiveCheckoutProducts(productIds: string[]) {
  const rows = await sql`
    SELECT id, price::float AS price, name, stock
    FROM "Product"
    WHERE id = ANY(${productIds}::text[]) AND active = true AND "deletedAt" IS NULL
  `

  return rows as CheckoutProductRow[]
}

export async function createOrder({
  contact,
  shipping,
  items,
  total,
  userId,
  status,
}: CreateOrderInput) {
  return prisma.order.create({
    data: {
      customerEmail: contact.email,
      customerName: `${contact.nombre} ${contact.apellido}`,
      customerPhone: contact.telefono,
      userId,
      total,
      status,
      shippingAddress: {
        calle: shipping.calle,
        numero: shipping.numero,
        pisoDpto: shipping.pisoDpto,
        ciudad: shipping.ciudad,
        provincia: shipping.provincia,
        codigoPostal: shipping.codigoPostal,
      },
      items: {
        create: items,
      },
    },
  })
}

export async function updateOrderPaymentState(
  orderId: string,
  status: OrderStatus,
  mpPreferenceId: string | null,
) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      mpPreferenceId,
    },
  })
}

export async function attachOrderPreference(orderId: string, mpPreferenceId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: { mpPreferenceId },
  })
}
