import { NextRequest, NextResponse } from 'next/server'
import { Payment } from 'mercadopago'
import { mpClient } from '@/shared/infrastructure/payments/mercadopago/client'
import { prisma } from '@/shared/infrastructure/db/prisma'
import { ensureOrderColumnSupport } from '@/shared/infrastructure/db/order-column-support'
import { mapMercadoPagoStatus, verifyMercadoPagoWebhookSignature } from '@/shared/infrastructure/payments/mercadopago/webhook'
import { importOrderShipment } from '@/features/checkout/application/sync-order-shipping'

export async function POST(req: NextRequest) {
  try {
    await ensureOrderColumnSupport()

    const body = await req.json()

    // MP sends topic=payment notifications
    if (body.type !== 'payment' || !body.data?.id) {
      return NextResponse.json({ ok: true })
    }

    const paymentId = String(body.data.id)
    const signatureIsValid = verifyMercadoPagoWebhookSignature({
      secret: process.env.MERCADOPAGO_WEBHOOK_SECRET,
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

    const orderId = payment.external_reference
    if (!orderId) {
      return NextResponse.json({ ok: true })
    }

    const newStatus = mapMercadoPagoStatus(payment.status)
    let shouldImportShipment = false

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            select: {
              productId: true,
              quantity: true,
            },
          },
        },
      })

      if (!order) {
        return
      }

      if (order.deletedAt) {
        return
      }

      if (order.status === 'paid' && order.mpPaymentId === paymentId) {
        return
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
        console.error('[mercadopago] payment mismatch detected', {
          orderId,
          paymentId,
          expectedAmount,
          paidAmount,
          expectedCurrency: 'ARS',
          paidCurrency: payment.currency_id ?? null,
          status: payment.status ?? null,
        })
        return
      }

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
      }

      const statusToPersist =
        order.status === 'paid' && newStatus !== 'paid' ? order.status : newStatus

      await tx.order.update({
        where: { id: orderId },
        data: {
          status: statusToPersist,
          mpPaymentId: paymentId,
          shippingStatus: shouldImportShipment ? 'import_pending' : order.shippingStatus,
          shippingError: shouldImportShipment ? null : order.shippingError,
        },
      })
    })

    if (shouldImportShipment) {
      await importOrderShipment(orderId)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[mercadopago] webhook processing failed', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
