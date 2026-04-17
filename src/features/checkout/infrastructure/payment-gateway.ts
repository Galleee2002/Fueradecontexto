import { Preference } from 'mercadopago'
import { SITE_URL } from '@/shared/config/site'
import { mpClient } from '@/shared/infrastructure/payments/mercadopago/client'
import type { ContactData } from '../types'

interface PaymentItem {
  productId: string
  quantity: number
  price: number
  name: string
}

export async function createMercadoPagoPreference(
  contact: ContactData,
  items: PaymentItem[],
  shippingItem: PaymentItem,
  orderId: string,
) {
  const preference = new Preference(mpClient)

  return preference.create({
    body: {
      items: [...items, shippingItem].map((item) => ({
        id: item.productId,
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'ARS',
      })),
      payer: {
        name: contact.nombre,
        surname: contact.apellido,
        email: contact.email,
        phone: { number: contact.telefono },
      },
      back_urls: {
        success: `${SITE_URL}/checkout/confirmacion`,
        failure: `${SITE_URL}/checkout/error`,
        pending: `${SITE_URL}/checkout/pendiente`,
      },
      auto_return: 'approved',
      notification_url: `${SITE_URL}/api/mercadopago/webhook`,
      external_reference: orderId,
      statement_descriptor: 'FUERADECONTEXTO',
    },
  })
}
