'use server'

import { createOrderAndPreferenceUseCase } from '../application/create-order-and-preference'
import type { ContactData, ShippingData, CartItemInput } from '../types'

export interface CreateOrderError {
  error: string
}

export interface CreatePreferenceResult {
  initPoint: string
}

export async function createOrderAndPreference(
  contact: ContactData,
  shipping: ShippingData,
  cartItems: CartItemInput[],
): Promise<CreatePreferenceResult | CreateOrderError> {
  return createOrderAndPreferenceUseCase(contact, shipping, cartItems)
}
