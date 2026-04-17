import { auth } from '@/auth'
import type { OrderStatus } from '@/shared/config/orders'
import {
  attachOrderPreference,
  createOrder,
  findActiveCheckoutProducts,
  updateOrderPaymentState,
} from '../infrastructure/order-repository'
import { createMercadoPagoPreference } from '../infrastructure/payment-gateway'
import { buildShippingQuote } from './build-shipping-quote'
import { checkoutCartSchema } from '../schemas/checkout-schema'
import type { CartItemInput, ContactData, ShippingData, ShippingSelection } from '../types'
import { buildQuoteSelectionMismatchError } from '../lib/shipping-dimensions'

export interface CreatePreferenceResult {
  initPoint: string
}

export interface CreateOrderError {
  error: string
}

export async function createOrderAndPreferenceUseCase(
  contact: ContactData,
  shipping: ShippingData,
  cartItems: CartItemInput[],
  shippingSelection: ShippingSelection,
): Promise<CreatePreferenceResult | CreateOrderError> {
  const cartParsed = checkoutCartSchema.safeParse(cartItems)
  if (!cartParsed.success) {
    return { error: 'Carrito inválido' }
  }

  const validatedCart = cartParsed.data
  const quantityByProductId = new Map<string, number>()

  for (const item of validatedCart) {
    quantityByProductId.set(item.productId, (quantityByProductId.get(item.productId) ?? 0) + item.quantity)
  }

  const productIds = [...quantityByProductId.keys()]
  const priceRows = await findActiveCheckoutProducts(productIds)

  if (priceRows.length !== productIds.length) {
    return { error: 'Uno o más productos no están disponibles' }
  }

  const productMap = new Map(
    priceRows.map((row) => [row.id, { price: row.price, name: row.name, stock: row.stock }]),
  )

  let subtotal = 0
  for (const [productId, quantity] of quantityByProductId.entries()) {
    const product = productMap.get(productId)

    if (!product) {
      return { error: 'Uno o más productos no están disponibles' }
    }

    if (product.stock < quantity) {
      return {
        error:
          product.stock <= 0
            ? `${product.name} no tiene stock disponible.`
            : `${product.name} solo tiene ${product.stock} unidad${product.stock === 1 ? '' : 'es'} disponible${product.stock === 1 ? '' : 's'}.`,
      }
    }

    subtotal += product.price * quantity
  }

  let shippingQuote
  try {
    shippingQuote = await buildShippingQuote(shipping, validatedCart)
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'No se pudo cotizar el envío.',
    }
  }

  const selectionMatches =
    shippingSelection.cartFingerprint === shippingQuote.cartFingerprint &&
    shippingSelection.addressFingerprint === shippingQuote.addressFingerprint &&
    shippingSelection.price === shippingQuote.price &&
    shippingSelection.productType === shippingQuote.productType &&
    shippingSelection.productName === shippingQuote.productName

  if (!selectionMatches) {
    return { error: buildQuoteSelectionMismatchError() }
  }

  const session = await auth()
  const userId = session?.user?.id ?? null
  const total = subtotal + shippingQuote.price

  let orderId: string | null = null
  let preferenceId: string | null = null

  try {
    const order = await createOrder({
      contact,
      shipping,
      subtotal,
      total,
      userId,
      status: 'pending' satisfies OrderStatus,
      shippingQuote,
      items: validatedCart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: productMap.get(item.productId)!.price,
      })),
    })

    orderId = order.id

    const mpResponse = await createMercadoPagoPreference(
      contact,
      validatedCart.map((item) => {
        const product = productMap.get(item.productId)!
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
          name: product.name,
        }
      }),
      {
        productId: 'shipping-correo-argentino',
        quantity: 1,
        price: shippingQuote.price,
        name: 'Envio Correo Argentino',
      },
      order.id,
    )

    preferenceId = mpResponse.id ?? null
    const initPoint = mpResponse.init_point

    if (!initPoint || !preferenceId) {
      await updateOrderPaymentState(order.id, 'cancelled', preferenceId)
      return { error: 'No se pudo iniciar el pago. Intente nuevamente.' }
    }

    await attachOrderPreference(order.id, preferenceId)

    return { initPoint }
  } catch (error) {
    if (orderId) {
      await updateOrderPaymentState(orderId, 'cancelled', preferenceId).catch(() => null)
    }

    console.error('[checkout] createOrderAndPreference error:', error)
    return { error: 'No se pudo procesar el pago. Intente nuevamente.' }
  }
}
