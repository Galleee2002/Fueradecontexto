import type { OrderStatus } from '@/lib/constants/orders'

export type StepId = 1 | 2 | 3

export interface ContactData {
  email: string
  nombre: string
  apellido: string
  telefono: string
}

export interface ShippingData {
  calle: string
  numero: string
  pisoDpto: string
  ciudad: string
  provincia: string
  codigoPostal: string
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
  orderId: string | null
}

export type CheckoutAction =
  | { type: 'SET_CONTACT'; data: ContactData }
  | { type: 'SET_SHIPPING'; data: ShippingData }
  | { type: 'PREV_STEP' }
  | { type: 'SET_ORDER_ID'; orderId: string }

export interface CartItemInput {
  productId: string
  quantity: number
}
