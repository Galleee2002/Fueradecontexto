'use client'

import { ArrowLeft, ShieldCheck } from 'lucide-react'
import type { ContactData, ShippingData } from '../types'

interface StepPaymentProps {
  contactData: ContactData
  shippingData: ShippingData
  onConfirm: () => void
  onBack: () => void
  isLoading: boolean
}

export function StepPayment({ contactData, shippingData, onConfirm, onBack, isLoading }: StepPaymentProps) {
  return (
    <div>
      <h2 className="font-serif text-2xl mb-8">Confirmar y pagar</h2>

      {/* Order review */}
      <div className="space-y-4 mb-8">
        <div className="border border-border p-4">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">Contacto</p>
          <p className="text-sm">{contactData.nombre} {contactData.apellido}</p>
          <p className="text-sm text-muted-foreground">{contactData.email}</p>
          <p className="text-sm text-muted-foreground">{contactData.telefono}</p>
        </div>

        <div className="border border-border p-4">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">Envío</p>
          <p className="text-sm">
            {shippingData.calle} {shippingData.numero}
            {shippingData.pisoDpto ? `, ${shippingData.pisoDpto}` : ''}
          </p>
          <p className="text-sm text-muted-foreground">
            {shippingData.ciudad}, {shippingData.provincia} ({shippingData.codigoPostal})
          </p>
        </div>
      </div>

      {/* MP security notice */}
      <div className="flex items-start gap-3 mb-8 p-4 bg-surface border border-border">
        <ShieldCheck className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-foreground mb-0.5">Pago seguro con Mercado Pago</p>
          <p className="text-xs text-muted-foreground">
            Serás redirigido al sitio de Mercado Pago para completar tu pago de forma segura.
            Aceptamos tarjetas de crédito, débito y más medios de pago.
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
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
          disabled={isLoading}
          className="w-full sm:w-auto bg-mp-blue hover:bg-mp-blue-hover disabled:opacity-60 text-primary-foreground px-10 py-4 text-xs font-medium tracking-widest uppercase rounded-none transition-colors flex items-center justify-center gap-3"
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
