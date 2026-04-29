import { NextRequest, NextResponse } from 'next/server'
import { Payment } from 'mercadopago'
import { mpClient } from '@/shared/infrastructure/payments/mercadopago/client'
import { prisma } from '@/shared/infrastructure/db/prisma'
import { ensureOrderColumnSupport } from '@/shared/infrastructure/db/order-column-support'
import { mapMercadoPagoStatus, verifyMercadoPagoWebhookSignature } from '@/shared/infrastructure/payments/mercadopago/webhook'
import { importOrderShipment } from '@/features/checkout/application/sync-order-shipping'
import { sendOrderEmailsForPaidOrder } from '@/features/checkout/application/send-order-emails'

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
    let paidOrderEmailPayload:
      | {
          orderId: string
          customerEmail: string
          customerName: string
          customerPhone: string
          total: number
          shippingMethod: string | null
          shippingCarrier: string | null
          shippingCost: number | null
          shippingAddress: unknown
          items: { productName: string; quantity: number; unitPrice: number }[]
        }
      | null = null

    await prisma.$transaction(async (tx) => {
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

    if (paidOrderEmailPayload) {
      try {
        await sendOrderEmailsForPaidOrder(paidOrderEmailPayload)
      } catch (emailError) {
        console.error('[checkout] paid order emails failed', {
          orderId,
          error: emailError,
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[mercadopago] webhook processing failed', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
