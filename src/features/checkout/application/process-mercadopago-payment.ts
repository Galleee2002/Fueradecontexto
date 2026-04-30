import { prisma } from '@/shared/infrastructure/db/prisma'
import { mapMercadoPagoStatus } from '@/shared/infrastructure/payments/mercadopago/webhook'
import type { PaidOrderEmailPayload } from '../emails/types'

export interface MercadoPagoPaymentSnapshot {
  id: string | number
  status?: string | null
  external_reference?: string | null
  transaction_amount?: number | string | null
  currency_id?: string | null
}

interface OrderItemForPayment {
  productId: string
  unitPrice: unknown
  quantity: number
  product: {
    name: string
  }
}

interface OrderForPayment {
  id: string
  status: string
  deletedAt: Date | null
  mpPaymentId: string | null
  total: unknown
  customerEmail: string
  customerName: string
  customerPhone: string
  shippingMethod: string | null
  shippingCarrier: string | null
  shippingCost: unknown
  shippingAddress: unknown
  shippingStatus: string
  shippingError: string | null
  items: OrderItemForPayment[]
}

interface PaymentProcessorTx {
  order: {
    findUnique(input: {
      where: { id: string }
      include: {
        items: {
          select: {
            productId: true
            unitPrice: true
            quantity: true
            product: { select: { name: true } }
          }
        }
      }
    }): Promise<OrderForPayment | null>
    update(input: {
      where: { id: string }
      data: {
        status: string
        mpPaymentId: string
        shippingStatus: string
        shippingError: string | null
      }
    }): Promise<unknown>
  }
  product: {
    updateMany(input: {
      where: {
        id: string
        active: true
        deletedAt: null
        stock: { gte: number }
      }
      data: { stock: { decrement: number } }
    }): Promise<{ count: number }>
  }
}

interface PaymentProcessorDb {
  transaction<T>(callback: (tx: PaymentProcessorTx) => Promise<T>): Promise<T>
}

export interface MercadoPagoPaymentProcessorDependencies {
  db?: PaymentProcessorDb
  importShipment?: (orderId: string) => Promise<void>
  sendPaidOrderEmails?: (payload: PaidOrderEmailPayload) => Promise<void>
  logger?: Pick<typeof console, 'error' | 'warn' | 'info'>
}

export type MercadoPagoPaymentProcessResult =
  | { status: 'ignored'; reason: 'missing_order_reference' | 'order_not_found' | 'order_deleted' }
  | { status: 'already_paid'; orderId: string }
  | { status: 'payment_mismatch'; orderId: string }
  | { status: 'updated'; orderId: string; orderStatus: string; emailsQueued: boolean; shipmentQueued: boolean }

interface TransactionResult {
  orderId: string | null
  paidOrderEmailPayload: PaidOrderEmailPayload | null
  shouldImportShipment: boolean
  processResult: MercadoPagoPaymentProcessResult
}

const defaultDb: PaymentProcessorDb = {
  transaction: (callback) => prisma.$transaction((tx) => callback(tx as unknown as PaymentProcessorTx)),
}

async function defaultSendPaidOrderEmails(payload: PaidOrderEmailPayload) {
  const { sendOrderEmailsForPaidOrder } = await import('./send-order-emails')
  await sendOrderEmailsForPaidOrder(payload)
}

async function defaultImportShipment(orderId: string) {
  const { importOrderShipment } = await import('./sync-order-shipping')
  await importOrderShipment(orderId)
}

export async function processMercadoPagoPayment(
  payment: MercadoPagoPaymentSnapshot,
  dependencies: MercadoPagoPaymentProcessorDependencies = {},
): Promise<MercadoPagoPaymentProcessResult> {
  const paymentId = String(payment.id)
  const orderId = payment.external_reference

  if (!orderId) {
    return { status: 'ignored', reason: 'missing_order_reference' }
  }

  const db = dependencies.db ?? defaultDb
  const logger = dependencies.logger ?? console
  const sendPaidOrderEmails = dependencies.sendPaidOrderEmails ?? defaultSendPaidOrderEmails
  const importShipment = dependencies.importShipment ?? defaultImportShipment
  const newStatus = mapMercadoPagoStatus(payment.status)

  const transactionResult = await db.transaction<TransactionResult>(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          select: {
            productId: true,
            unitPrice: true,
            quantity: true,
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      return {
        orderId: null,
        paidOrderEmailPayload: null,
        shouldImportShipment: false,
        processResult: { status: 'ignored', reason: 'order_not_found' },
      }
    }

    if (order.deletedAt) {
      return {
        orderId: order.id,
        paidOrderEmailPayload: null,
        shouldImportShipment: false,
        processResult: { status: 'ignored', reason: 'order_deleted' },
      }
    }

    if (order.status === 'paid' && order.mpPaymentId === paymentId) {
      return {
        orderId: order.id,
        paidOrderEmailPayload: null,
        shouldImportShipment: false,
        processResult: { status: 'already_paid', orderId: order.id },
      }
    }

    const paidAmount =
      typeof payment.transaction_amount === 'number'
        ? payment.transaction_amount
        : Number(payment.transaction_amount ?? Number.NaN)
    const expectedAmount = Number(order.total)
    const amountMatches =
      Number.isFinite(paidAmount) && Math.abs(paidAmount - expectedAmount) < 0.01
    const currencyMatches = payment.currency_id === 'ARS'

    if (newStatus === 'paid' && (!amountMatches || !currencyMatches)) {
      logger.error('[mercadopago] payment mismatch detected', {
        orderId: order.id,
        paymentId,
        expectedAmount,
        paidAmount,
        expectedCurrency: 'ARS',
        paidCurrency: payment.currency_id ?? null,
        status: payment.status ?? null,
      })

      return {
        orderId: order.id,
        paidOrderEmailPayload: null,
        shouldImportShipment: false,
        processResult: { status: 'payment_mismatch', orderId: order.id },
      }
    }

    let shouldImportShipment = false
    let paidOrderEmailPayload: PaidOrderEmailPayload | null = null

    if (newStatus === 'paid' && order.status !== 'paid') {
      for (const item of order.items) {
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            active: true,
            deletedAt: null,
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })

        if (updated.count !== 1) {
          throw new Error(`Insufficient stock for product ${item.productId}`)
        }
      }

      shouldImportShipment = true
      paidOrderEmailPayload = {
        orderId: order.id,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        total: Number(order.total),
        shippingMethod: order.shippingMethod,
        shippingCarrier: order.shippingCarrier,
        shippingCost: order.shippingCost ? Number(order.shippingCost) : null,
        shippingAddress: order.shippingAddress,
        items: order.items.map((item) => ({
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
        })),
      }
    }

    const statusToPersist =
      order.status === 'paid' && newStatus !== 'paid' ? order.status : newStatus

    await tx.order.update({
      where: { id: order.id },
      data: {
        status: statusToPersist,
        mpPaymentId: paymentId,
        shippingStatus: shouldImportShipment ? 'import_pending' : order.shippingStatus,
        shippingError: shouldImportShipment ? null : order.shippingError,
      },
    })

    return {
      orderId: order.id,
      paidOrderEmailPayload,
      shouldImportShipment,
      processResult: {
        status: 'updated',
        orderId: order.id,
        orderStatus: statusToPersist,
        emailsQueued: Boolean(paidOrderEmailPayload),
        shipmentQueued: shouldImportShipment,
      },
    }
  })

  if (transactionResult.paidOrderEmailPayload) {
    try {
      await sendPaidOrderEmails(transactionResult.paidOrderEmailPayload)
    } catch (emailError) {
      logger.error('[checkout] paid order emails failed', {
        orderId,
        error: emailError,
      })
    }
  }

  if (transactionResult.shouldImportShipment && transactionResult.orderId) {
    try {
      await importShipment(transactionResult.orderId)
    } catch (shipmentError) {
      logger.error('[checkout] paid order shipment import failed after payment processing', {
        orderId,
        error: shipmentError,
      })
    }
  }

  return transactionResult.processResult
}
