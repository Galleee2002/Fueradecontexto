import { createHmac, timingSafeEqual } from 'node:crypto'
import type { OrderStatus } from '@/shared/config/orders'

type MpStatus = string | null | undefined

function parseSignatureHeader(header: string | null) {
  if (!header) {
    return null
  }

  const parts = header.split(',').map((part) => part.trim())
  const ts = parts.find((part) => part.startsWith('ts='))?.slice(3)
  const v1 = parts.find((part) => part.startsWith('v1='))?.slice(3)

  if (!ts || !v1) {
    return null
  }

  return { ts, v1 }
}

function createManifest({
  dataId,
  requestId,
  ts,
}: {
  dataId: string
  requestId: string
  ts: string
}) {
  return `id:${dataId};request-id:${requestId};ts:${ts};`
}

function secureCompare(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)

  if (left.length !== right.length) {
    return false
  }

  return timingSafeEqual(left, right)
}

export function verifyMercadoPagoWebhookSignature({
  secret,
  signatureHeader,
  requestIdHeader,
  dataId,
}: {
  secret: string | undefined
  signatureHeader: string | null
  requestIdHeader: string | null
  dataId: string
}) {
  if (!secret) {
    return process.env.NODE_ENV !== 'production'
  }

  const parsed = parseSignatureHeader(signatureHeader)
  if (!parsed || !requestIdHeader) {
    return false
  }

  const manifest = createManifest({
    dataId,
    requestId: requestIdHeader,
    ts: parsed.ts,
  })

  const expected = createHmac('sha256', secret).update(manifest).digest('hex')
  return secureCompare(expected, parsed.v1)
}

export function mapMercadoPagoStatus(mpStatus: MpStatus): OrderStatus {
  switch (mpStatus) {
    case 'approved':
      return 'paid'
    case 'rejected':
    case 'cancelled':
      return 'cancelled'
    default:
      return 'pending'
  }
}
