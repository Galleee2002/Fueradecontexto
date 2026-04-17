'use server'

import { createOrderAndPreferenceUseCase } from '../application/create-order-and-preference'
import { buildShippingQuote } from '../application/build-shipping-quote'
import { ShippingQuoteError } from '../lib/shipping-quote-error'
import type {
  ContactData,
  ShippingData,
  CartItemInput,
  ShippingSelection,
  ShippingQuote,
  QuoteShippingErrorCode,
  ShippingFormErrors,
} from '../types'

export interface CreateOrderError {
  error: string
}

export interface QuoteShippingErrorResult {
  error: string
  code: QuoteShippingErrorCode
  fieldErrors?: ShippingFormErrors
}

export interface CreatePreferenceResult {
  initPoint: string
}

export interface QuoteShippingResult {
  quote: ShippingQuote
}

export async function createOrderAndPreference(
  contact: ContactData,
  shipping: ShippingData,
  cartItems: CartItemInput[],
  shippingSelection: ShippingSelection,
): Promise<CreatePreferenceResult | CreateOrderError> {
  return createOrderAndPreferenceUseCase(contact, shipping, cartItems, shippingSelection)
}

export async function quoteShipping(
  shipping: ShippingData,
  cartItems: CartItemInput[],
): Promise<QuoteShippingResult | QuoteShippingErrorResult> {
  try {
    const quote = await buildShippingQuote(shipping, cartItems)
    return { quote }
  } catch (error) {
    if (error instanceof ShippingQuoteError) {
      const response: QuoteShippingErrorResult = {
        error: error.message,
        code: error.code,
      }

      if (error.fieldErrors) {
        response.fieldErrors = error.fieldErrors
      }

      return response
    }

    return {
      error: error instanceof Error ? error.message : 'No se pudo cotizar el envío.',
      code: 'carrier_error',
    }
  }
}
