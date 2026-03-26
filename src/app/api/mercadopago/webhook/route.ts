import { NextRequest, NextResponse } from 'next/server'
import { Payment } from 'mercadopago'
import { mpClient } from '@/lib/mercadopago/client'
import { prisma } from '@/lib/db/prisma'

type MpStatus = string | null | undefined

function mapMpStatus(mpStatus: MpStatus): string {
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // MP sends topic=payment notifications
    if (body.type !== 'payment' || !body.data?.id) {
      return NextResponse.json({ ok: true })
    }

    const paymentId = String(body.data.id)
    const paymentClient = new Payment(mpClient)
    const payment = await paymentClient.get({ id: paymentId })

    const orderId = payment.external_reference
    if (!orderId) {
      return NextResponse.json({ ok: true })
    }

    const newStatus = mapMpStatus(payment.status)

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        mpPaymentId: paymentId,
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    // Always return 200 so MP doesn't keep retrying
    return NextResponse.json({ ok: true })
  }
}
