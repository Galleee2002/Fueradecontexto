'use server'

import { z } from 'zod'
import { Preference } from 'mercadopago'
import { prisma } from '@/lib/db/prisma'
import { sql } from '@/lib/db/client'
import { auth } from '@/auth'
import { SITE_URL } from '@/lib/constants/site'
import { mpClient } from '@/lib/mercadopago/client'
import type { ContactData, ShippingData, CartItemInput } from '../types'
import type { OrderStatus } from '@/lib/constants/orders'

const cartItemSchema = z.object({
  productId: z.string().min(1),
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
  stock: number
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
  const quantityByProductId = new Map<string, number>()
  for (const item of validatedCart) {
    quantityByProductId.set(item.productId, (quantityByProductId.get(item.productId) ?? 0) + item.quantity)
  }

  const productIds = [...quantityByProductId.keys()]

  // Re-fetch prices from DB (never trust client-side prices)
  const priceRows = await sql`
    SELECT id, price::float AS price, name, stock
    FROM "Product"
    WHERE id = ANY(${productIds}::text[]) AND active = true AND "deletedAt" IS NULL
  `

  if (priceRows.length !== productIds.length) {
    return { error: 'Uno o más productos no están disponibles' }
  }

  const productMap = new Map(
    (priceRows as ProductRow[]).map((r) => [r.id, { price: r.price, name: r.name, stock: r.stock }]),
  )

  // Calculate total server-side
  let total = 0
  for (const [productId, quantity] of quantityByProductId.entries()) {
    const product = productMap.get(productId)!
    if (product.stock < quantity) {
      return {
        error:
          product.stock <= 0
            ? `${product.name} no tiene stock disponible.`
            : `${product.name} solo tiene ${product.stock} unidad${product.stock === 1 ? '' : 'es'} disponible${product.stock === 1 ? '' : 's'}.`,
      }
    }

    total += product.price * quantity
  }

  // Get optional userId from session
  const session = await auth()
  const userId = session?.user?.id ?? null

  let orderId: string | null = null
  let preferenceId: string | null = null

  try {
    // Create order in DB
    const order = await prisma.order.create({
      data: {
        customerEmail: contact.email,
        customerName: `${contact.nombre} ${contact.apellido}`,
        customerPhone: contact.telefono,
        userId,
        total,
        status: 'pending' satisfies OrderStatus,
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

    orderId = order.id

    // Create Mercado Pago preference
    const preference = new Preference(mpClient)
    const mpResponse = await preference.create({
      body: {
        items: validatedCart.map((item) => {
          const { price, name } = productMap.get(item.productId)!
          return {
            id: item.productId,
            title: name,
            quantity: item.quantity,
            unit_price: price,
            currency_id: 'ARS',
          }
        }),
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
        external_reference: order.id,
        statement_descriptor: 'FUERADECONTEXTO',
      },
    })

    preferenceId = mpResponse.id ?? null
    const initPoint = mpResponse.init_point

    if (!initPoint || !preferenceId) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'cancelled',
          mpPreferenceId: preferenceId,
        },
      })

      return { error: 'No se pudo iniciar el pago. Intente nuevamente.' }
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { mpPreferenceId: preferenceId },
    })

    return { initPoint }
  } catch (err) {
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'cancelled',
          mpPreferenceId: preferenceId,
        },
      }).catch(() => null)
    }
    console.error('[checkout] createOrderAndPreference error:', err)
    return {
      error: 'No se pudo procesar el pago. Intente nuevamente.',
    }
  }
}
