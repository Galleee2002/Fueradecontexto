import { prisma } from '@/shared/infrastructure/db/prisma'
import { sql } from '@/shared/infrastructure/db/client'
import { Prisma } from '../../../../generated/prisma/client'
import type { ContactData, ShippingData, ShippingQuote } from '../types'
import type { OrderStatus } from '@/shared/config/orders'
import type { OrderShippingStatus } from '@/shared/config/shipping'

export interface CheckoutProductRow {
  id: string
  price: number
  name: string
  stock: number
  shippingWeightGrams: number | null
  shippingHeightCm: number | null
  shippingWidthCm: number | null
  shippingLengthCm: number | null
}

interface CreateOrderInput {
  contact: ContactData
  shipping: ShippingData
  items: { productId: string; quantity: number; unitPrice: number }[]
  subtotal: number
  total: number
  userId: string | null
  status: OrderStatus
  shippingQuote: ShippingQuote
}

export async function findActiveCheckoutProducts(productIds: string[]) {
  const rows = await sql`
    SELECT id, price::float AS price, name, stock,
           "shippingWeightGrams", "shippingHeightCm", "shippingWidthCm", "shippingLengthCm"
    FROM "Product"
    WHERE id = ANY(${productIds}::text[]) AND active = true AND "deletedAt" IS NULL
  `

  return rows as CheckoutProductRow[]
}

export async function createOrder({
  contact,
  shipping,
  items,
  subtotal,
  total,
  userId,
  status,
  shippingQuote,
}: CreateOrderInput) {
  return prisma.order.create({
    data: {
      customerEmail: contact.email,
      customerName: `${contact.nombre} ${contact.apellido}`,
      customerPhone: contact.telefono,
      userId,
      total,
      status,
      shippingMethod: shippingQuote.method,
      shippingCarrier: shippingQuote.carrier,
      shippingCost: shippingQuote.price,
      shippingQuotePayload: {
        productType: shippingQuote.productType,
        productName: shippingQuote.productName,
        deliveryType: shippingQuote.deliveryType,
        deliveryTimeMin: shippingQuote.deliveryTimeMin,
        deliveryTimeMax: shippingQuote.deliveryTimeMax,
        validTo: shippingQuote.validTo,
        subtotal,
      },
      shippingDimensions: {
        weightGrams: shippingQuote.dimensions.weightGrams,
        heightCm: shippingQuote.dimensions.heightCm,
        widthCm: shippingQuote.dimensions.widthCm,
        lengthCm: shippingQuote.dimensions.lengthCm,
      },
      shippingStatus: 'not_imported',
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

export async function updateOrderShippingState(
  orderId: string,
  input: {
    shippingStatus?: OrderShippingStatus
    status?: OrderStatus
    shippingImportedAt?: Date | null
    shippingLastSyncAt?: Date | null
    shippingError?: string | null
    shippingExternalId?: string | null
    trackingNumber?: string | null
    shippingTrackingPayload?: unknown
  },
) {
  const data: Prisma.OrderUpdateInput = {}

  if (input.shippingStatus !== undefined) data.shippingStatus = input.shippingStatus
  if (input.status !== undefined) data.status = input.status
  if (input.shippingImportedAt !== undefined) data.shippingImportedAt = input.shippingImportedAt
  if (input.shippingLastSyncAt !== undefined) data.shippingLastSyncAt = input.shippingLastSyncAt
  if (input.shippingError !== undefined) data.shippingError = input.shippingError
  if (input.shippingExternalId !== undefined) data.shippingExternalId = input.shippingExternalId
  if (input.trackingNumber !== undefined) data.trackingNumber = input.trackingNumber
  if (input.shippingTrackingPayload !== undefined) {
    data.shippingTrackingPayload = input.shippingTrackingPayload as Prisma.InputJsonValue
  }

  return prisma.order.update({
    where: { id: orderId },
    data,
  })
}

export async function markOrderShippingImportPending(orderId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      shippingStatus: 'import_pending',
      shippingError: null,
    },
  })
}
