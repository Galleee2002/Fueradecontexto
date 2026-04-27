'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container } from '@/shared/ui/layout/container'
import { useCart } from '@/features/cart/hooks/use-cart'
import { CheckoutSteps } from '@/features/checkout/components/checkout-steps'
import { StepContact } from '@/features/checkout/components/step-contact'
import { StepShipping } from '@/features/checkout/components/step-shipping'
import { StepPayment } from '@/features/checkout/components/step-payment'
import { OrderSummary } from '@/features/checkout/components/order-summary'
import { OrderSummaryAccordion } from '@/features/checkout/components/order-summary-accordion'
import { useCheckout } from '@/features/checkout/hooks/use-checkout'
import { createOrderAndPreference, quoteShipping } from '@/features/checkout/actions/checkout-actions'
import type { ShippingFormErrors } from '@/features/checkout/types'
import { buildAddressFingerprint } from '@/shared/infrastructure/shipping/correo-argentino/utils'

export default function CheckoutPage() {
  const { isEmpty, clearCart, items, totalPrice } = useCart()
  const router = useRouter()
  const { state, advanceContact, advanceShipping, prevStep, setShippingQuote, clearShippingQuote } = useCheckout()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isShippingQuoteLoading, setIsShippingQuoteLoading] = useState(false)
  const [shippingQuoteError, setShippingQuoteError] = useState<string | null>(null)
  const [shippingFieldErrors, setShippingFieldErrors] = useState<ShippingFormErrors>({})

  const cartSignature = items
    .map((item) => `${item.productId}:${item.quantity}`)
    .sort()
    .join('|')
  const shippingAddressSignature = state.shippingData
    ? buildAddressFingerprint(state.shippingData)
    : null
  const checkoutTotal = totalPrice + (state.shippingQuote?.price ?? 0)

  useEffect(() => {
    if (isEmpty) {
      router.replace('/carrito')
    }
  }, [isEmpty, router])

  useEffect(() => {
    if (state.step !== 3 || !state.shippingData || items.length === 0) {
      return
    }

    const currentCartInput = items.map((item) => ({ productId: item.productId, quantity: item.quantity }))
    const currentShippingData = state.shippingData

    const quoteIsFresh =
      state.shippingQuote &&
      state.shippingQuote.cartFingerprint === cartSignature &&
      state.shippingQuote.addressFingerprint === shippingAddressSignature

    if (quoteIsFresh) {
      return
    }

    let cancelled = false

    async function loadQuote() {
      setIsShippingQuoteLoading(true)
      setShippingQuoteError(null)
      clearShippingQuote()

      const result = await quoteShipping(currentShippingData, currentCartInput)

      if (cancelled) return

      if ('error' in result) {
        setShippingQuoteError(result.error)
        setIsShippingQuoteLoading(false)

        if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
          setShippingFieldErrors(result.fieldErrors)
          prevStep()
        }

        return
      }

      setShippingFieldErrors({})
      setShippingQuote(result.quote)
      setIsShippingQuoteLoading(false)
    }

    void loadQuote()

    return () => {
      cancelled = true
    }
  }, [
    state.step,
    state.shippingData,
    items,
    cartSignature,
    state.shippingQuote,
    setShippingQuote,
    clearShippingQuote,
    shippingAddressSignature,
    prevStep,
  ])

  async function handleConfirmPayment() {
    if (!state.contactData || !state.shippingData || !state.shippingQuote) return

    setIsLoading(true)
    setError(null)
    setShippingQuoteError(null)
    const cartInput = items.map((item) => ({ productId: item.productId, quantity: item.quantity }))

    const result = await createOrderAndPreference(
      state.contactData,
      state.shippingData,
      cartInput,
      state.shippingQuote,
    )

    if ('error' in result) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    clearCart()
    window.location.href = result.initPoint
  }

  if (isEmpty && items.length === 0) return null

  return (
    <main className="brand-page min-h-screen">
      <Container>
        <div className="mb-10">
          <div className="brand-panel px-6 py-7 sm:px-8 sm:py-8">
            <p className="brand-kicker">Checkout</p>
            <h1 className="mt-3 text-4xl font-medium tracking-[-0.05em] md:text-5xl">Finalizá tu compra</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Revisión de contacto, envío y pago en un flujo único, claro y consistente con el resto de la tienda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div className="brand-panel-solid px-6 py-7 sm:px-8">
            {error && (
              <div
                className="mb-6 rounded-[1.15rem] border border-error-border bg-error-subtle px-4 py-3 text-sm text-error-foreground"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}
            <CheckoutSteps currentStep={state.step} />

            {state.step === 1 && (
              <StepContact
                defaultValues={state.contactData}
                onNext={advanceContact}
              />
            )}

            {state.step === 2 && (
              <StepShipping
                defaultValues={state.shippingData}
                serverErrors={shippingFieldErrors}
                onNext={(data) => {
                  setShippingFieldErrors({})
                  setShippingQuoteError(null)
                  advanceShipping(data)
                }}
                onBack={prevStep}
              />
            )}

            {state.step === 3 && state.contactData && state.shippingData && (
              <StepPayment
                contactData={state.contactData}
                shippingData={state.shippingData}
                shippingQuote={state.shippingQuote}
                onConfirm={handleConfirmPayment}
                onBack={prevStep}
                isLoading={isLoading}
                isShippingQuoteLoading={isShippingQuoteLoading}
                shippingQuoteError={shippingQuoteError}
              />
            )}
          </div>

          <OrderSummaryAccordion total={checkoutTotal}>
            <OrderSummary
              shippingQuote={state.shippingQuote}
              isShippingQuoteLoading={isShippingQuoteLoading}
            />
          </OrderSummaryAccordion>
        </div>
      </Container>
    </main>
  )
}
