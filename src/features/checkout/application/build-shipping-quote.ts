import { checkoutCartSchema, shippingSchema } from '../schemas/checkout-schema'
import type { CartItemInput, ShippingData, ShippingQuote } from '../types'
import { findActiveCheckoutProducts } from '../infrastructure/order-repository'
import {
  buildCartFingerprint,
  buildShippingDimensions,
  sanitizeShippingAddress,
  validateStockForCheckout,
} from '../lib/shipping-dimensions'
import { ShippingQuoteError } from '../lib/shipping-quote-error'
import {
  buildAddressFingerprint,
  buildPostalCodeForProvinceCode,
  getProvinceCodeForShipping,
  normalizePostalCode,
  postalCodeMatchesProvinceCode,
} from '@/shared/infrastructure/shipping/correo-argentino/utils'
import { getCorreoArgentinoConfig } from '@/shared/infrastructure/shipping/correo-argentino/config'
import { quoteCorreoArgentinoRates } from '@/shared/infrastructure/shipping/correo-argentino/client'
import {
  SHIPPING_CARRIER_CORREO_ARGENTINO,
  SHIPPING_CORREO_ARGENTINO_ENABLED,
  SHIPPING_METHOD_CORREO_ARGENTINO_HOME,
} from '@/shared/config/shipping'

export async function buildShippingQuote(
  shipping: ShippingData,
  cartItems: CartItemInput[],
): Promise<ShippingQuote> {
  if (!SHIPPING_CORREO_ARGENTINO_ENABLED) {
    throw new Error('El cálculo de envío está deshabilitado temporalmente.')
  }

  const cartParsed = checkoutCartSchema.safeParse(cartItems)
  if (!cartParsed.success) {
    throw new Error('Carrito inválido')
  }

  const validatedCart = cartParsed.data
  const productIds = [...new Set(validatedCart.map((item) => item.productId))]
  const products = await findActiveCheckoutProducts(productIds)

  if (products.length !== productIds.length) {
    throw new Error('Uno o más productos no están disponibles')
  }

  validateStockForCheckout(validatedCart, products)

  const shippingParsed = shippingSchema.safeParse(shipping)

  if (!shippingParsed.success) {
    const fieldErrors = Object.fromEntries(
      shippingParsed.error.issues.map((issue) => [issue.path[0], issue.message]),
    )

    throw new ShippingQuoteError('Revisá los datos de envío ingresados.', 'invalid_address', fieldErrors)
  }

  const sanitizedShipping = sanitizeShippingAddress(shippingParsed.data)
  const destinationProvinceCode = getProvinceCodeForShipping(sanitizedShipping.provincia)
  const config = await getCorreoArgentinoConfig()
  const originProvinceCode = normalizePostalCode(config.sender.provinceCode ?? '')

  if (!originProvinceCode) {
    throw new Error('La provincia de origen no está configurada para Correo Argentino.')
  }

  if (!postalCodeMatchesProvinceCode(sanitizedShipping.codigoPostal, destinationProvinceCode)) {
    throw new ShippingQuoteError(
      'El código postal no coincide con la provincia seleccionada.',
      'invalid_postal_code',
      { codigoPostal: 'El código postal no coincide con la provincia seleccionada.' },
    )
  }

  const destinationPostalCode = buildPostalCodeForProvinceCode(
    sanitizedShipping.codigoPostal,
    destinationProvinceCode,
  )
  const dimensions = buildShippingDimensions(validatedCart, products)
  const originPostalCode = buildPostalCodeForProvinceCode(config.originPostalCode, originProvinceCode)

  const response = await quoteCorreoArgentinoRates({
    customerId: config.customerId,
    postalCodeOrigin: originPostalCode,
    postalCodeDestination: destinationPostalCode,
    deliveredType: 'D',
    dimensions: {
      weight: dimensions.weightGrams,
      height: dimensions.heightCm,
      width: dimensions.widthCm,
      length: dimensions.lengthCm,
    },
  })

  const selectedRate = response.rates.find((rate) => rate.deliveredType === 'D')

  if (!selectedRate) {
    console.warn('[correo-argentino] no valid home rate returned', {
      customerId: config.customerId,
      postalCodeOrigin: originPostalCode,
      postalCodeDestination: destinationPostalCode,
      rawPostalCodeDestination: sanitizedShipping.codigoPostal,
      rates: response.rates,
    })

    if (response.rates.length === 0) {
      throw new ShippingQuoteError(
        'Correo Argentino no devolvió tarifas para este destino. Revisá el código postal ingresado y la configuración de envíos.',
        'no_coverage',
        { codigoPostal: 'No encontramos cobertura para ese código postal.' },
      )
    }

    if (response.rates.some((rate) => rate.deliveredType === 'S')) {
      throw new ShippingQuoteError(
        'Correo Argentino no ofrece envío a domicilio para este destino, solo retiro en sucursal.',
        'no_coverage',
        { codigoPostal: 'Ese código postal no tiene entrega a domicilio.' },
      )
    }

    throw new ShippingQuoteError(
      'Correo Argentino no devolvió una tarifa válida para este destino.',
      'carrier_error',
    )
  }

  return {
    carrier: SHIPPING_CARRIER_CORREO_ARGENTINO,
    method: SHIPPING_METHOD_CORREO_ARGENTINO_HOME,
    productType: selectedRate.productType,
    productName: selectedRate.productName,
    deliveryType: 'D',
    price: Number(selectedRate.price),
    deliveryTimeMin: selectedRate.deliveryTimeMin,
    deliveryTimeMax: selectedRate.deliveryTimeMax,
    validTo: response.validTo ?? '',
    destinationPostalCode,
    destinationProvinceCode,
    dimensions,
    cartFingerprint: buildCartFingerprint(validatedCart),
    addressFingerprint: buildAddressFingerprint(sanitizedShipping),
  }
}
