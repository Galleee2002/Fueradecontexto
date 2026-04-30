import { NextRequest, NextResponse } from 'next/server'
import { Payment } from 'mercadopago'
import { mpClient } from '@/shared/infrastructure/payments/mercadopago/client'
import { ensureOrderColumnSupport } from '@/shared/infrastructure/db/order-column-support'
import { verifyMercadoPagoWebhookSignature } from '@/shared/infrastructure/payments/mercadopago/webhook'
import { processMercadoPagoPayment } from '@/features/checkout/application/process-mercadopago-payment'

export async function POST(req: NextRequest) {
  try {
    await ensureOrderColumnSupport()

    const body = await req.json()

    // MP sends topic=payment notifications
    if (body.type !== 'payment' || !body.data?.id) {
      return NextResponse.json({ ok: true })
    }

    const paymentId = String(body.data.id)
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET
    if (!webhookSecret && process.env.NODE_ENV === 'production') {
      console.error('[mercadopago] MERCADOPAGO_WEBHOOK_SECRET is not configured in production', {
        paymentId,
        requestId: req.headers.get('x-request-id'),
      })
    }

    const signatureIsValid = verifyMercadoPagoWebhookSignature({
      secret: webhookSecret,
      signatureHeader: req.headers.get('x-signature'),
      requestIdHeader: req.headers.get('x-request-id'),
      dataId: paymentId,
    })

    if (!signatureIsValid) {
      console.error('[mercadopago] invalid webhook signature', {
        paymentId,
        requestId: req.headers.get('x-request-id'),
      })
      return NextResponse.json({ ok: false }, { status: 401 })
    }

    const paymentClient = new Payment(mpClient)
    const payment = await paymentClient.get({ id: paymentId })

    await processMercadoPagoPayment({
      id: paymentId,
      status: payment.status ?? null,
      external_reference: payment.external_reference ?? null,
      transaction_amount: payment.transaction_amount ?? null,
      currency_id: payment.currency_id ?? null,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[mercadopago] webhook processing failed', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
