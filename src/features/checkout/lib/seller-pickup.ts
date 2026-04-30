import type { ShippingData } from '../types'

/** Dirección donde el cliente retira el pedido (sin envío por Correo). */
export const SELLER_PICKUP_STREET_LINE = 'Luis Viale 711'
export const SELLER_PICKUP_CITY = 'Ciudad Autónoma de Buenos Aires'

export function getCanonicalSellerPickupShipping(): ShippingData {
  return {
    fulfillmentMethod: 'seller_pickup',
    deliveryType: 'D',
    calle: 'Luis Viale',
    numero: '711',
    pisoDpto: '',
    ciudad: SELLER_PICKUP_CITY,
    provincia: 'Ciudad Autónoma de Buenos Aires',
    codigoPostal: '1414',
    agencyCode: '',
    agencyName: '',
  }
}
