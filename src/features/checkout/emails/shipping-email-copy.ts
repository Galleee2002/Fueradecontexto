import { SHIPPING_METHOD_SELLER_PICKUP } from '@/shared/config/shipping'

export function isSellerPickupFromPayload(
  shippingMethod: string | null,
  shippingAddress: unknown,
): boolean {
  if (shippingMethod === SHIPPING_METHOD_SELLER_PICKUP) return true
  if (shippingAddress && typeof shippingAddress === 'object' && 'fulfillmentMethod' in shippingAddress) {
    return (shippingAddress as { fulfillmentMethod?: string }).fulfillmentMethod === 'seller_pickup'
  }
  return false
}

/** Dirección legible (destino Correo o punto de retiro). */
export function formatShippingAddressLines(shippingAddress: unknown): string {
  if (!shippingAddress || typeof shippingAddress !== 'object') {
    return 'No disponible'
  }

  const addr = shippingAddress as Record<string, unknown>
  const parts = [addr.calle, addr.numero, addr.pisoDpto, addr.ciudad, addr.provincia, addr.codigoPostal]
    .filter((part) => typeof part === 'string' && part.trim().length > 0)
    .map((part) => String(part).trim())

  return parts.length > 0 ? parts.join(', ') : 'No disponible'
}

export function formatCorreoBranchNote(shippingAddress: unknown): string | null {
  if (!shippingAddress || typeof shippingAddress !== 'object') return null
  const code = (shippingAddress as { agencyCode?: string }).agencyCode
  if (typeof code !== 'string' || !code.trim()) return null
  return `Sucursal Correo Argentino: ${code.trim()}`
}

export function customerShippingModeLabel(
  shippingMethod: string | null,
  shippingAddress: unknown,
): string {
  if (isSellerPickupFromPayload(shippingMethod, shippingAddress)) {
    return 'Retiro en domicilio (sin costo de envío)'
  }
  if (shippingMethod === 'correo_argentino_branch') {
    return 'Retiro en sucursal de Correo Argentino'
  }
  if (shippingMethod === 'correo_argentino_home') {
    return 'Envío a tu domicilio (Correo Argentino)'
  }
  return 'Envío o retiro'
}
