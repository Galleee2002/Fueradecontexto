import assert from 'node:assert/strict'
import test from 'node:test'
import {
  reconcilePaidOrders,
  type ReconcilePaidOrdersDependencies,
} from './reconcile-paid-orders'
import type { MercadoPagoPaymentSnapshot } from './process-mercadopago-payment'

function createLogger() {
  return {
    error() {},
    warn() {},
    info() {},
    log() {},
  }
}

test('reconcilePaidOrders processes pending orders with approved payments when apply mode is enabled', async () => {
  const processed: MercadoPagoPaymentSnapshot[] = []

  const dependencies = {
    db: {
      async findPendingOrdersWithPreference() {
        return [
          { id: 'order-paid', mpPreferenceId: 'preference-1' },
          { id: 'order-unpaid', mpPreferenceId: 'preference-2' },
        ]
      },
    },
    async findApprovedPaymentByOrderId(orderId: string) {
      if (orderId !== 'order-paid') return null

      return {
        id: 'payment-1',
        status: 'approved',
        external_reference: orderId,
        transaction_amount: 10,
        currency_id: 'ARS',
      }
    },
    async processPayment(payment: MercadoPagoPaymentSnapshot) {
      processed.push(payment)
    },
    logger: createLogger(),
  } satisfies ReconcilePaidOrdersDependencies

  const result = await reconcilePaidOrders({ dryRun: false }, dependencies)

  assert.deepEqual(result, {
    scanned: 2,
    approvedFound: 1,
    processed: 1,
    skipped: 1,
    failed: 0,
  })
  assert.equal(processed.length, 1)
  assert.equal(processed[0]?.id, 'payment-1')
})

test('reconcilePaidOrders dry-run reports approved payments without processing them', async () => {
  const processed: MercadoPagoPaymentSnapshot[] = []

  const dependencies = {
    db: {
      async findPendingOrdersWithPreference() {
        return [{ id: 'order-paid', mpPreferenceId: 'preference-1' }]
      },
    },
    async findApprovedPaymentByOrderId(orderId: string) {
      return {
        id: 'payment-1',
        status: 'approved',
        external_reference: orderId,
        transaction_amount: 10,
        currency_id: 'ARS',
      }
    },
    async processPayment(payment: MercadoPagoPaymentSnapshot) {
      processed.push(payment)
    },
    logger: createLogger(),
  } satisfies ReconcilePaidOrdersDependencies

  const result = await reconcilePaidOrders({ dryRun: true }, dependencies)

  assert.deepEqual(result, {
    scanned: 1,
    approvedFound: 1,
    processed: 0,
    skipped: 0,
    failed: 0,
  })
  assert.equal(processed.length, 0)
})
