'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/shared/layout/container'
import { useCart } from '@/features/cart/hooks/use-cart'
import { CheckoutSteps } from '@/features/checkout/components/checkout-steps'
import { StepContact } from '@/features/checkout/components/step-contact'
import { StepShipping } from '@/features/checkout/components/step-shipping'
import { StepPayment } from '@/features/checkout/components/step-payment'
import { OrderSummary } from '@/features/checkout/components/order-summary'
import { OrderSummaryAccordion } from '@/features/checkout/components/order-summary-accordion'
import { useCheckout } from '@/features/checkout/hooks/use-checkout'
import { createOrderAndPreference } from '@/features/checkout/actions/checkout-actions'

export default function CheckoutPage() {
  const { isEmpty, clearCart, items } = useCart()
  const router = useRouter()
  const { state, advanceContact, advanceShipping, prevStep } = useCheckout()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEmpty) {
      router.replace('/carrito')
    }
  }, [isEmpty, router])

  async function handleConfirmPayment() {
    if (!state.contactData || !state.shippingData) return

    setIsLoading(true)
    setError(null)

    const cartInput = items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
    const result = await createOrderAndPreference(state.contactData, state.shippingData, cartInput)

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
    <main className="py-12 min-h-screen">
      <Container>
        <div className="mb-10 pb-8 border-b border-border">
          <h1 className="font-serif text-3xl md:text-4xl">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          <div>
            {error && (
              <div
                className="mb-6 border border-error-border bg-error-subtle text-error-foreground px-4 py-3 text-sm"
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
                onNext={advanceShipping}
                onBack={prevStep}
              />
            )}

            {state.step === 3 && state.contactData && state.shippingData && (
              <StepPayment
                contactData={state.contactData}
                shippingData={state.shippingData}
                onConfirm={handleConfirmPayment}
                onBack={prevStep}
                isLoading={isLoading}
              />
            )}
          </div>

          <OrderSummaryAccordion>
            <OrderSummary />
          </OrderSummaryAccordion>
        </div>
      </Container>
    </main>
  )
}
