import { sendBrevoEmail } from '@/shared/infrastructure/email/brevo-client'
import { render } from '@react-email/render'
import { createElement } from 'react'
import { NewOrderAdminEmail } from '../emails/new-order-admin-email'
import { OrderConfirmationEmail } from '../emails/order-confirmation-email'
import type { PaidOrderEmailPayload } from '../emails/types'

export async function sendOrderEmailsForPaidOrder(payload: PaidOrderEmailPayload) {
  const adminEmail = process.env.EMAIL_ADMIN

  if (!adminEmail) {
    throw new Error('EMAIL_ADMIN is not configured.')
  }

  const customerHtml = await render(createElement(OrderConfirmationEmail, { payload }))
  const adminHtml = await render(createElement(NewOrderAdminEmail, { payload }))

  await Promise.all([
    sendBrevoEmail({
      to: [{ email: payload.customerEmail, name: payload.customerName }],
      subject: `Confirmacion de compra #${payload.orderId}`,
      htmlContent: customerHtml,
    }),
    sendBrevoEmail({
      to: [{ email: adminEmail }],
      subject: `Nueva orden pagada #${payload.orderId}`,
      htmlContent: adminHtml,
    }),
  ])
}
