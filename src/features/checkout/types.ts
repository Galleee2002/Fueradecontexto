import type { OrderStatus } from '@/shared/config/orders'

export type StepId = 1 | 2 | 3

export interface ContactData {
  email: string
  nombre: string
  apellido: string
  telefono: string
}

export interface ShippingData {
  deliveryType: 'D' | 'S'
  calle: string
  numero: string
  pisoDpto: string
  ciudad: string
  provincia: string
  codigoPostal: string
  agencyCode: string
  agencyName: string
}

export type ShippingFormErrors = Partial<Record<keyof ShippingData, string>>

export type QuoteShippingErrorCode =
  | 'invalid_address'
  | 'invalid_postal_code'
  | 'no_coverage'
  | 'carrier_error'

export interface ShippingDimensions {
  weightGrams: number
  heightCm: number
  widthCm: number
  lengthCm: number
}

export interface ShippingQuote {
  carrier: 'correo_argentino'
  method: 'correo_argentino_home' | 'correo_argentino_branch'
  productType: string
  productName: string
  deliveryType: 'D' | 'S'
  agencyCode: string | null
  agencyName: string | null
  price: number
  deliveryTimeMin: string
  deliveryTimeMax: string
  validTo: string
  destinationPostalCode: string
  destinationProvinceCode: string
  dimensions: ShippingDimensions
  cartFingerprint: string
  addressFingerprint: string
}

export type ShippingSelection = ShippingQuote

export interface OrderShippingSnapshot {
  method: string
  carrier: string
  cost: number
  quote: ShippingQuote
}

export interface PaymentData {
  numeroTarjeta: string
  vencimiento: string
  cvv: string
  nombreTarjeta: string
}

export interface CheckoutFormData {
  contact: ContactData
  shipping: ShippingData
  payment?: PaymentData
}

export interface CheckoutState {
  step: StepId
  contactData: ContactData | null
  shippingData: ShippingData | null
  shippingQuote: ShippingQuote | null
  orderId: string | null
}

export type CheckoutAction =
  | { type: 'SET_CONTACT'; data: ContactData }
  | { type: 'SET_SHIPPING'; data: ShippingData }
  | { type: 'SET_SHIPPING_QUOTE'; data: ShippingQuote }
  | { type: 'CLEAR_SHIPPING_QUOTE' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_ORDER_ID'; orderId: string }

export interface CartItemInput {
  productId: string
  quantity: number
}
