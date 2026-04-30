import assert from 'node:assert/strict'
import test from 'node:test'
import {
  processMercadoPagoPayment,
  type MercadoPagoPaymentProcessorDependencies,
} from './process-mercadopago-payment'

interface MutableFakeOrder {
  id: string
  status: string
  deletedAt: Date | null
  mpPaymentId: string | null
  total: number
  customerEmail: string
  customerName: string
  customerPhone: string
  shippingMethod: string | null
  shippingCarrier: string | null
  shippingCost: number | null
  shippingAddress: Record<string, unknown>
  shippingStatus: string
  shippingError: string | null
  items: Array<{
    productId: string
    unitPrice: number
    quantity: number
    product: { name: string }
  }>
}

function createFakeOrder(overrides: Partial<MutableFakeOrder> = {}): MutableFakeOrder {
  return {
    id: 'order-1',
    status: 'pending',
    deletedAt: null,
    mpPaymentId: null,
    total: 10,
    customerEmail: 'customer@example.com',
    customerName: 'Customer Test',
    customerPhone: '123456789',
    shippingMethod: 'correo_argentino_home',
    shippingCarrier: 'correo_argentino',
    shippingCost: 0,
    shippingAddress: { calle: 'Calle', numero: '123' },
    shippingStatus: 'not_imported',
    shippingError: null,
    items: [
      {
        productId: 'product-1',
        unitPrice: 10,
        quantity: 1,
        product: { name: 'Producto Test' },
      },
    ],
    ...overrides,
  }
}

function createDependencies(order: MutableFakeOrder | null) {
  const calls = {
    stockDecrements: 0,
    orderUpdates: 0,
    emails: 0,
    shipments: 0,
    errors: [] as unknown[],
  }

  const db = {
    async transaction<T>(callback: Parameters<NonNullable<MercadoPagoPaymentProcessorDependencies['db']>['transaction']>[0]) {
      const tx = {
        order: {
          async findUnique() {
            return order
          },
          async update(input: {
            data: {
              status: string
              mpPaymentId: string
              shippingStatus: string
              shippingError: string | null
            }
          }) {
            calls.orderUpdates += 1

            if (order) {
              order.status = input.data.status
              order.mpPaymentId = input.data.mpPaymentId
              order.shippingStatus = input.data.shippingStatus
              order.shippingError = input.data.shippingError
            }

            return order
          },
        },
        product: {
          async updateMany() {
            calls.stockDecrements += 1
            return { count: 1 }
          },
        },
      }

      return callback(tx as never) as Promise<T>
    },
  } satisfies NonNullable<MercadoPagoPaymentProcessorDependencies['db']>

  const dependencies = {
    db,
    async sendPaidOrderEmails() {
      calls.emails += 1
    },
    async importShipment() {
      calls.shipments += 1
    },
    logger: {
      error(...args: unknown[]) {
        calls.errors.push(args)
      },
      warn() {},
      info() {},
    },
  } satisfies MercadoPagoPaymentProcessorDependencies

  return { dependencies, calls }
}

test('processMercadoPagoPayment marks an approved order paid and sends post-purchase emails', async () => {
  const order = createFakeOrder()
  const { dependencies, calls } = createDependencies(order)

  const result = await processMercadoPagoPayment(
    {
      id: 'payment-1',
      status: 'approved',
      external_reference: order.id,
      transaction_amount: 10,
      currency_id: 'ARS',
    },
    dependencies,
  )

  assert.deepEqual(result, {
    status: 'updated',
    orderId: order.id,
    orderStatus: 'paid',
    emailsQueued: true,
    shipmentQueued: true,
  })
  assert.equal(order.status, 'paid')
  assert.equal(order.mpPaymentId, 'payment-1')
  assert.equal(order.shippingStatus, 'import_pending')
  assert.equal(calls.stockDecrements, 1)
  assert.equal(calls.emails, 1)
  assert.equal(calls.shipments, 1)
})

test('processMercadoPagoPayment does not duplicate work for the same already paid payment', async () => {
  const order = createFakeOrder({
    status: 'paid',
    mpPaymentId: 'payment-1',
  })
  const { dependencies, calls } = createDependencies(order)

  const result = await processMercadoPagoPayment(
    {
      id: 'payment-1',
      status: 'approved',
      external_reference: order.id,
      transaction_amount: 10,
      currency_id: 'ARS',
    },
    dependencies,
  )

  assert.deepEqual(result, { status: 'already_paid', orderId: order.id })
  assert.equal(calls.stockDecrements, 0)
  assert.equal(calls.orderUpdates, 0)
  assert.equal(calls.emails, 0)
  assert.equal(calls.shipments, 0)
})

test('processMercadoPagoPayment does not mark paid when amount or currency mismatches', async () => {
  const order = createFakeOrder()
  const { dependencies, calls } = createDependencies(order)

  const result = await processMercadoPagoPayment(
    {
      id: 'payment-1',
      status: 'approved',
      external_reference: order.id,
      transaction_amount: 12,
      currency_id: 'ARS',
    },
    dependencies,
  )

  assert.deepEqual(result, { status: 'payment_mismatch', orderId: order.id })
  assert.equal(order.status, 'pending')
  assert.equal(order.mpPaymentId, null)
  assert.equal(calls.stockDecrements, 0)
  assert.equal(calls.orderUpdates, 0)
  assert.equal(calls.emails, 0)
  assert.equal(calls.shipments, 0)
  assert.equal(calls.errors.length, 1)
})
