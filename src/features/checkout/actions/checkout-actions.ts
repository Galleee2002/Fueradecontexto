'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db/prisma'
import { sql } from '@/lib/db/client'
import { auth } from '@/auth'
import type { CheckoutFormData, CartItemInput } from '../types'

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

export async function createOrder(
  data: CheckoutFormData,
  cartItems: CartItemInput[],
): Promise<CreateOrderResult | CreateOrderError> {
  // Validate cart items
  const cartParsed = z.array(cartItemSchema).min(1).safeParse(cartItems)
  if (!cartParsed.success) {
    return { error: 'Carrito inválido' }
  }

  const validatedCart = cartParsed.data
  const productIds = validatedCart.map((i) => i.productId)

  // Re-fetch prices from DB (never trust client-side prices)
  const priceRows = await sql`
    SELECT id, price::float AS price
    FROM "Product"
    WHERE id = ANY(${productIds}::text[]) AND active = true
  `

  if (priceRows.length !== productIds.length) {
    return { error: 'Uno o más productos no están disponibles' }
  }

  const priceMap = new Map(
    (priceRows as { id: string; price: number }[]).map((r) => [r.id, r.price]),
  )

  // Calculate total server-side
  let total = 0
  for (const item of validatedCart) {
    const unitPrice = priceMap.get(item.productId)!
    total += unitPrice * item.quantity
  }

  // Get optional userId from session
  const session = await auth()
  const userId = session?.user?.id ?? null

  const { contact, shipping } = data

  try {
    const order = await prisma.$transaction(async (tx) => {
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
              unitPrice: priceMap.get(item.productId)!,
            })),
          },
        },
      })
      return created
    })

    return { orderId: order.id }
  } catch {
    return { error: 'No se pudo crear la orden. Intente nuevamente.' }
  }
}
