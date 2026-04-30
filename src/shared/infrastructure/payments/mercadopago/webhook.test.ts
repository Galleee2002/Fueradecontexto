import { createHmac } from 'node:crypto'
import assert from 'node:assert/strict'
import test from 'node:test'
import { verifyMercadoPagoWebhookSignature } from './webhook'

function withNodeEnv<T>(nodeEnv: string | undefined, callback: () => T) {
  const previous = process.env.NODE_ENV
  const mutableEnv = process.env as Record<string, string | undefined>

  if (nodeEnv === undefined) {
    delete mutableEnv.NODE_ENV
  } else {
    mutableEnv.NODE_ENV = nodeEnv
  }

  try {
    return callback()
  } finally {
    if (previous === undefined) {
      delete mutableEnv.NODE_ENV
    } else {
      mutableEnv.NODE_ENV = previous
    }
  }
}

function sign({
  secret,
  dataId,
  requestId,
  ts,
}: {
  secret: string
  dataId: string
  requestId: string
  ts: string
}) {
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`
  return createHmac('sha256', secret).update(manifest).digest('hex')
}

test('verifyMercadoPagoWebhookSignature rejects missing secret in production', () => {
  withNodeEnv('production', () => {
    assert.equal(
      verifyMercadoPagoWebhookSignature({
        secret: undefined,
        signatureHeader: null,
        requestIdHeader: null,
        dataId: 'payment-1',
      }),
      false,
    )
  })
})

test('verifyMercadoPagoWebhookSignature allows missing secret outside production', () => {
  withNodeEnv('development', () => {
    assert.equal(
      verifyMercadoPagoWebhookSignature({
        secret: undefined,
        signatureHeader: null,
        requestIdHeader: null,
        dataId: 'payment-1',
      }),
      true,
    )
  })
})

test('verifyMercadoPagoWebhookSignature accepts a valid Mercado Pago signature', () => {
  const secret = 'webhook-secret'
  const dataId = '156261020909'
  const requestId = 'request-id'
  const ts = '1777513611'
  const v1 = sign({ secret, dataId, requestId, ts })

  assert.equal(
    verifyMercadoPagoWebhookSignature({
      secret,
      signatureHeader: `ts=${ts},v1=${v1}`,
      requestIdHeader: requestId,
      dataId,
    }),
    true,
  )
})

test('verifyMercadoPagoWebhookSignature rejects invalid or incomplete signatures', () => {
  assert.equal(
    verifyMercadoPagoWebhookSignature({
      secret: 'webhook-secret',
      signatureHeader: 'ts=1777513611,v1=bad-signature',
      requestIdHeader: 'request-id',
      dataId: 'payment-1',
    }),
    false,
  )

  assert.equal(
    verifyMercadoPagoWebhookSignature({
      secret: 'webhook-secret',
      signatureHeader: 'ts=1777513611',
      requestIdHeader: 'request-id',
      dataId: 'payment-1',
    }),
    false,
  )
})
