import { prisma } from '@/shared/infrastructure/db/prisma'
import {
  processMercadoPagoPayment,
  type MercadoPagoPaymentSnapshot,
} from './process-mercadopago-payment'

interface PendingOrderForReconciliation {
  id: string
  mpPreferenceId: string | null
}

interface ReconcilePaidOrdersDb {
  findPendingOrdersWithPreference(limit: number): Promise<PendingOrderForReconciliation[]>
}

export interface ReconcilePaidOrdersDependencies {
  db?: ReconcilePaidOrdersDb
  findApprovedPaymentByOrderId?: (orderId: string) => Promise<MercadoPagoPaymentSnapshot | null>
  processPayment?: (payment: MercadoPagoPaymentSnapshot) => Promise<unknown>
  logger?: Pick<typeof console, 'error' | 'warn' | 'info' | 'log'>
}

export interface ReconcilePaidOrdersOptions {
  dryRun?: boolean
  limit?: number
}

export interface ReconcilePaidOrdersResult {
  scanned: number
  approvedFound: number
  processed: number
  skipped: number
  failed: number
}

const defaultDb: ReconcilePaidOrdersDb = {
  async findPendingOrdersWithPreference(limit) {
    return prisma.order.findMany({
      where: {
        status: 'pending',
        mpPreferenceId: {
          not: null,
        },
        mpPaymentId: null,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: limit,
      select: {
        id: true,
        mpPreferenceId: true,
      },
    })
  },
}

export async function reconcilePaidOrders(
  options: ReconcilePaidOrdersOptions = {},
  dependencies: ReconcilePaidOrdersDependencies = {},
): Promise<ReconcilePaidOrdersResult> {
  const dryRun = options.dryRun ?? true
  const limit = options.limit ?? 50
  const db = dependencies.db ?? defaultDb
  const findApprovedPaymentByOrderId =
    dependencies.findApprovedPaymentByOrderId ?? findApprovedMercadoPagoPaymentByOrderId
  const processPayment = dependencies.processPayment ?? processMercadoPagoPayment
  const logger = dependencies.logger ?? console

  const orders = await db.findPendingOrdersWithPreference(limit)
  const result: ReconcilePaidOrdersResult = {
    scanned: orders.length,
    approvedFound: 0,
    processed: 0,
    skipped: 0,
    failed: 0,
  }

  for (const order of orders) {
    try {
      const payment = await findApprovedPaymentByOrderId(order.id)

      if (!payment) {
        result.skipped += 1
        logger.info('[reconcile-paid-orders] no approved payment found', {
          orderId: order.id,
          mpPreferenceId: order.mpPreferenceId,
        })
        continue
      }

      result.approvedFound += 1

      if (dryRun) {
        logger.info('[reconcile-paid-orders] approved payment found (dry-run)', {
          orderId: order.id,
          paymentId: payment.id,
        })
        continue
      }

      await processPayment(payment)
      result.processed += 1
      logger.info('[reconcile-paid-orders] order processed', {
        orderId: order.id,
        paymentId: payment.id,
      })
    } catch (error) {
      result.failed += 1
      logger.error('[reconcile-paid-orders] order failed', {
        orderId: order.id,
        error,
      })
    }
  }

  return result
}

export async function findApprovedMercadoPagoPaymentByOrderId(orderId: string) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

  if (!accessToken) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN is not configured.')
  }

  const url = new URL('https://api.mercadopago.com/v1/payments/search')
  url.searchParams.set('external_reference', orderId)

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Mercado Pago payment search failed (${response.status}): ${body}`)
  }

  const body = (await response.json()) as {
    results?: Array<MercadoPagoPaymentSnapshot>
  }

  return body.results?.find((payment) => payment.status === 'approved') ?? null
}
