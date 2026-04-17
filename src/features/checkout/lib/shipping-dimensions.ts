import type { CartItemInput, ShippingData, ShippingDimensions } from '../types'

interface ProductShippingRow {
  id: string
  name: string
  stock: number
  shippingWeightGrams: number | null
  shippingHeightCm: number | null
  shippingWidthCm: number | null
  shippingLengthCm: number | null
}

export function buildCartFingerprint(cartItems: CartItemInput[]) {
  return [...cartItems]
    .map((item) => `${item.productId}:${item.quantity}`)
    .sort()
    .join('|')
}

export function buildShippingDimensions(
  cartItems: CartItemInput[],
  products: ProductShippingRow[],
): ShippingDimensions {
  const productMap = new Map(products.map((product) => [product.id, product]))

  let totalWeight = 0
  let totalHeight = 0
  let maxWidth = 0
  let maxLength = 0

  for (const item of cartItems) {
    const product = productMap.get(item.productId)

    if (!product) {
      throw new Error('Uno o más productos no están disponibles para envío.')
    }

    if (
      product.shippingWeightGrams == null ||
      product.shippingHeightCm == null ||
      product.shippingWidthCm == null ||
      product.shippingLengthCm == null
    ) {
      throw new Error(
        `${product.name} no tiene sus dimensiones logísticas configuradas y no puede enviarse todavía.`,
      )
    }

    totalWeight += product.shippingWeightGrams * item.quantity
    totalHeight += product.shippingHeightCm * item.quantity
    maxWidth = Math.max(maxWidth, product.shippingWidthCm)
    maxLength = Math.max(maxLength, product.shippingLengthCm)
  }

  const dimensions = {
    weightGrams: totalWeight,
    heightCm: totalHeight,
    widthCm: maxWidth,
    lengthCm: maxLength,
  }

  if (dimensions.weightGrams < 1 || dimensions.weightGrams > 25000) {
    throw new Error('El carrito excede el peso permitido por Correo Argentino.')
  }

  if (
    dimensions.heightCm < 1 ||
    dimensions.heightCm > 150 ||
    dimensions.widthCm < 1 ||
    dimensions.widthCm > 150 ||
    dimensions.lengthCm < 1 ||
    dimensions.lengthCm > 150
  ) {
    throw new Error('El carrito excede las dimensiones permitidas por Correo Argentino.')
  }

  return dimensions
}

export function validateStockForCheckout(cartItems: CartItemInput[], products: ProductShippingRow[]) {
  const quantityByProductId = new Map<string, number>()

  for (const item of cartItems) {
    quantityByProductId.set(item.productId, (quantityByProductId.get(item.productId) ?? 0) + item.quantity)
  }

  for (const product of products) {
    const requested = quantityByProductId.get(product.id) ?? 0

    if (requested > product.stock) {
      throw new Error(
        product.stock <= 0
          ? `${product.name} no tiene stock disponible.`
          : `${product.name} solo tiene ${product.stock} unidad${product.stock === 1 ? '' : 'es'} disponible${product.stock === 1 ? '' : 's'}.`,
      )
    }
  }
}

export function buildQuoteSelectionMismatchError() {
  return 'La cotización de envío cambió. Revisá el envío antes de continuar al pago.'
}

export function buildRecipientName(contact: { nombre: string; apellido: string }) {
  return `${contact.nombre} ${contact.apellido}`.trim()
}

export function sanitizeShippingAddress(data: ShippingData) {
  return {
    calle: data.calle.trim(),
    numero: data.numero.trim(),
    pisoDpto: data.pisoDpto.trim(),
    ciudad: data.ciudad.trim(),
    provincia: data.provincia.trim(),
    codigoPostal: data.codigoPostal.trim(),
  }
}
