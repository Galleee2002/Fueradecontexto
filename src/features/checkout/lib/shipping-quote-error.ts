import type { QuoteShippingErrorCode, ShippingFormErrors } from '../types'

export class ShippingQuoteError extends Error {
  code: QuoteShippingErrorCode
  fieldErrors: ShippingFormErrors | undefined

  constructor(message: string, code: QuoteShippingErrorCode, fieldErrors?: ShippingFormErrors) {
    super(message)
    this.name = 'ShippingQuoteError'
    this.code = code
    this.fieldErrors = fieldErrors
  }
}
