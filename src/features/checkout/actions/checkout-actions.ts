'use server'

import { z } from 'zod'
import { Preference } from 'mercadopago'
import { prisma } from '@/lib/db/prisma'
import { sql } from '@/lib/db/client'
import { auth } from '@/auth'
import { mpClient } from '@/lib/mercadopago/client'
import type { ContactData, ShippingData, CartItemInput } from '../types'

const cartItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().min(1).max(10),
})

export interface CreateOrderResult {
  orderId: string
}

export interface CreateOrderError {
  error: string
}

export interface CreatePreferenceResult {
  initPoint: string
}

interface ProductRow {
  id: string
  price: number
  name: string
}

export async function createOrderAndPreference(
  contact: ContactData,
  shipping: ShippingData,
  cartItems: CartItemInput[],
): Promise<CreatePreferenceResult | CreateOrderError> {
  // Validate cart items
  const cartParsed = z.array(cartItemSchema).min(1).safeParse(cartItems)
  if (!cartParsed.success) {
    return { error: 'Carrito inválido' }
  }

  const validatedCart = cartParsed.data
  const productIds = validatedCart.map((i) => i.productId)

  // Re-fetch prices from DB (never trust client-side prices)
  const priceRows = await sql`
    SELECT id, price::float AS price, name
    FROM "Product"
    WHERE id = ANY(${productIds}::text[]) AND active = true
  `

  if (priceRows.length !== productIds.length) {
    return { error: 'Uno o más productos no están disponibles' }
  }

  const productMap = new Map(
    (priceRows as ProductRow[]).map((r) => [r.id, { price: r.price, name: r.name }]),
  )

  // Calculate total server-side
  let total = 0
  for (const item of validatedCart) {
    const { price } = productMap.get(item.productId)!
    total += price * item.quantity
  }

  // Get optional userId from session
  const session = await auth()
  const userId = session?.user?.id ?? null

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  try {
    // Create order in DB
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const order = await prisma.$transaction(async (tx: any) => {
      const created = await tx.order.create({
        data: {
          customerEmail: contact.email,
          customerName: `${contact.nombre} ${contact.apellido}`,
          customerPhone: contact.telefono,
          userId,
          total,
          status: 'pending',
          shippingAddress: {
            calle: shipping.calle,
            numero: shipping.numero,
            pisoDpto: shipping.pisoDpto,
            ciudad: shipping.ciudad,
            provincia: shipping.provincia,
            codigoPostal: shipping.codigoPostal,
          },
          items: {
            create: validatedCart.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: productMap.get(item.productId)!.price,
            })),
          },
        },
      })
      return created
    })

    // Build MP preference items
    const mpItems = validatedCart.map((item) => {
      const { price, name } = productMap.get(item.productId)!
      return {
        id: item.productId,
        title: name,
        quantity: item.quantity,
        unit_price: price,
        currency_id: 'ARS',
      }
    })

    // Create Mercado Pago preference
    const preference = new Preference(mpClient)
    const mpResponse = await preference.create({
      body: {
        items: mpItems,
        payer: {
          name: contact.nombre,
          surname: contact.apellido,
          email: contact.email,
          phone: { number: contact.telefono },
        },
        back_urls: {
          success: `${siteUrl}/checkout/confirmacion`,
          failure: `${siteUrl}/checkout/error`,
          pending: `${siteUrl}/checkout/pendiente`,
        },
        auto_return: 'approved',
        notification_url: `${siteUrl}/api/mercadopago/webhook`,
        external_reference: order.id,
        statement_descriptor: 'FUERADECONTEXTO',
      },
    })

    // Save preferenceId to order
    await prisma.order.update({
      where: { id: order.id },
      data: { mpPreferenceId: mpResponse.id ?? null },
    })

    const initPoint = mpResponse.init_point
    if (!initPoint) {
      return { error: 'No se pudo iniciar el pago. Intente nuevamente.' }
    }

    return { initPoint }
  } catch {
    return { error: 'No se pudo procesar el pago. Intente nuevamente.' }
  }
}
