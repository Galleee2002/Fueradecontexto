'use client'

import { ArrowLeft, ShieldCheck } from 'lucide-react'
import type { ContactData, ShippingData, ShippingQuote } from '../types'
import { formatPrice } from '@/shared/lib/format-price'

interface StepPaymentProps {
  contactData: ContactData
  shippingData: ShippingData
  shippingQuote: ShippingQuote | null
  onConfirm: () => void
  onBack: () => void
  isLoading: boolean
  isShippingQuoteLoading: boolean
  shippingQuoteError: string | null
}

export function StepPayment({
  contactData,
  shippingData,
  shippingQuote,
  onConfirm,
  onBack,
  isLoading,
  isShippingQuoteLoading,
  shippingQuoteError,
}: StepPaymentProps) {
  const isSubmitDisabled = isLoading || isShippingQuoteLoading || !shippingQuote || !!shippingQuoteError

  return (
    <div>
      <div className="mb-8 space-y-2">
        <p className="brand-kicker">Paso 3</p>
        <h2 className="text-3xl font-medium tracking-[-0.05em]">Confirmar y pagar</h2>
      </div>

      {/* Order review */}
      <div className="space-y-4 mb-8">
        <div className="brand-panel-solid p-4">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">Contacto</p>
          <p className="text-sm">{contactData.nombre} {contactData.apellido}</p>
          <p className="text-sm text-muted-foreground">{contactData.email}</p>
          <p className="text-sm text-muted-foreground">{contactData.telefono}</p>
        </div>

        <div className="brand-panel-solid p-4">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">Envío</p>
          {shippingData.fulfillmentMethod === 'seller_pickup' ? (
            <>
              <p className="text-sm font-medium text-foreground">Retiro en domicilio (Domicilio)</p>
              <p className="text-sm text-muted-foreground mt-1">
                {shippingData.calle} {shippingData.numero}, {shippingData.ciudad}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm">
                {shippingData.calle} {shippingData.numero}
                {shippingData.pisoDpto ? `, ${shippingData.pisoDpto}` : ''}
              </p>
              <p className="text-sm text-muted-foreground">
                {shippingData.ciudad}, {shippingData.provincia} ({shippingData.codigoPostal})
              </p>
              <p className="text-sm text-muted-foreground">
                Entrega: {shippingData.deliveryType === 'S' ? 'Retiro en sucursal (Correo)' : 'Envío a tu domicilio'}
                {shippingData.deliveryType === 'S' && shippingData.agencyCode ? ` (${shippingData.agencyCode})` : ''}
              </p>
            </>
          )}
          <div className="mt-3 border-t border-border pt-3 space-y-1.5">
            {isShippingQuoteLoading ? (
              <p className="text-sm text-muted-foreground">
                {shippingData.fulfillmentMethod === 'seller_pickup'
                  ? 'Confirmando retiro…'
                  : 'Cotizando envío con Correo Argentino…'}
              </p>
            ) : shippingQuoteError ? (
              <p className="text-sm text-error">{shippingQuoteError}</p>
            ) : shippingQuote ? (
              <>
                <p className="text-sm font-medium text-foreground">
                  {shippingQuote.productName}
                  {shippingQuote.price > 0 ? ` · ${formatPrice(shippingQuote.price)}` : ' · Sin cargo'}
                </p>
                {shippingQuote.method === 'seller_pickup' ? (
                  <p className="text-xs text-muted-foreground">
                    Retirás el pedido en el domicilio indicado; no aplica envío por Correo Argentino.
                  </p>
                ) : null}
                {shippingQuote.deliveryType === 'S' && shippingQuote.agencyCode ? (
                  <p className="text-xs text-muted-foreground">
                    Retiro en sucursal {shippingQuote.agencyCode}
                    {shippingQuote.agencyName ? ` · ${shippingQuote.agencyName}` : ''}.
                  </p>
                ) : null}
                {shippingQuote.method !== 'seller_pickup' ? (
                  <p className="text-xs text-muted-foreground">
                    Entrega estimada entre {shippingQuote.deliveryTimeMin} y {shippingQuote.deliveryTimeMax} días hábiles.
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Todavía no hay una cotización válida.</p>
            )}
          </div>
        </div>
      </div>

      {/* MP security notice */}
      <div className="mb-8 flex items-start gap-3 rounded-[1.25rem] border border-border bg-surface p-4">
        <ShieldCheck className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-foreground mb-0.5">Pago seguro con Mercado Pago</p>
          <p className="text-xs text-muted-foreground">
            Serás redirigido al sitio de Mercado Pago para completar tu pago de forma segura.
            Aceptamos tarjetas de crédito, débito y más medios de pago.
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitDisabled}
          className="flex w-full items-center justify-center gap-3 rounded-full bg-mp-blue px-10 py-4 text-xs font-medium uppercase tracking-[0.24em] text-primary-foreground transition-colors hover:bg-mp-blue-hover disabled:opacity-60 sm:w-auto"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Procesando…
            </>
          ) : (
            'Ir a pagar'
          )}
        </button>
      </div>
    </div>
  )
}
