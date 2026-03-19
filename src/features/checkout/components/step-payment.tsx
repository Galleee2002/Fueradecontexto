'use client'

import { useState } from 'react'
import { z } from 'zod'
import { ArrowLeft, Lock } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { PaymentData } from '../types'

const paymentSchema = z.object({
  numeroTarjeta: z
    .string()
    .min(19, 'El número de tarjeta es inválido')
    .max(19, 'El número de tarjeta es inválido'),
  vencimiento: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, 'Formato inválido. Ej: 08/28'),
  cvv: z
    .string()
    .min(3, 'CVV inválido')
    .max(4, 'CVV inválido'),
  nombreTarjeta: z.string().min(1, 'El nombre en la tarjeta es requerido'),
})

type FormErrors = Partial<Record<keyof PaymentData, string>>

interface StepPaymentProps {
  defaultValues?: Partial<PaymentData>
  onSubmit: (data: PaymentData) => void
  onBack: () => void
  isLoading: boolean
}

const inputBase =
  'w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 rounded-none transition-colors'

const labelBase = 'block text-xs tracking-widest uppercase text-muted-foreground mb-2'

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }
  return digits
}

export function StepPayment({ defaultValues, onSubmit, onBack, isLoading }: StepPaymentProps) {
  const [values, setValues] = useState<PaymentData>({
    numeroTarjeta: defaultValues?.numeroTarjeta ?? '',
    vencimiento: defaultValues?.vencimiento ?? '',
    cvv: defaultValues?.cvv ?? '',
    nombreTarjeta: defaultValues?.nombreTarjeta ?? '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  function clearError(field: keyof PaymentData) {
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function handleCardNumber(raw: string) {
    const formatted = formatCardNumber(raw)
    setValues((prev) => ({ ...prev, numeroTarjeta: formatted }))
    if (errors.numeroTarjeta) clearError('numeroTarjeta')
  }

  function handleExpiry(raw: string) {
    const formatted = formatExpiry(raw)
    setValues((prev) => ({ ...prev, vencimiento: formatted }))
    if (errors.vencimiento) clearError('vencimiento')
  }

  function handleChange(field: keyof PaymentData, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) clearError(field)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = paymentSchema.safeParse(values)

    if (!result.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof PaymentData
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="font-serif text-2xl mb-8">Información de pago</h2>

      <div className="space-y-6">
        {/* Número de tarjeta */}
        <div>
          <label htmlFor="numeroTarjeta" className={labelBase}>
            Número de tarjeta
          </label>
          <input
            id="numeroTarjeta"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            value={values.numeroTarjeta}
            onChange={(e) => handleCardNumber(e.target.value)}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className={cn(inputBase, 'tracking-widest', errors.numeroTarjeta && 'border-red-500 focus-visible:ring-red-500')}
          />
          {errors.numeroTarjeta && (
            <p className="mt-1.5 text-xs text-red-500">{errors.numeroTarjeta}</p>
          )}
        </div>

        {/* Nombre en tarjeta */}
        <div>
          <label htmlFor="nombreTarjeta" className={labelBase}>
            Nombre en la tarjeta
          </label>
          <input
            id="nombreTarjeta"
            type="text"
            autoComplete="cc-name"
            value={values.nombreTarjeta}
            onChange={(e) => handleChange('nombreTarjeta', e.target.value.toUpperCase())}
            placeholder="JUAN GARCÍA"
            className={cn(
              inputBase,
              'tracking-wider',
              errors.nombreTarjeta && 'border-red-500 focus-visible:ring-red-500'
            )}
          />
          {errors.nombreTarjeta && (
            <p className="mt-1.5 text-xs text-red-500">{errors.nombreTarjeta}</p>
          )}
        </div>

        {/* Vencimiento + CVV */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="vencimiento" className={labelBase}>
              Vencimiento
            </label>
            <input
              id="vencimiento"
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              value={values.vencimiento}
              onChange={(e) => handleExpiry(e.target.value)}
              placeholder="MM/AA"
              maxLength={5}
              className={cn(
                inputBase,
                errors.vencimiento && 'border-red-500 focus-visible:ring-red-500'
              )}
            />
            {errors.vencimiento && (
              <p className="mt-1.5 text-xs text-red-500">{errors.vencimiento}</p>
            )}
          </div>

          <div>
            <label htmlFor="cvv" className={labelBase}>
              CVV
            </label>
            <input
              id="cvv"
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              value={values.cvv}
              onChange={(e) =>
                handleChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))
              }
              placeholder="•••"
              maxLength={4}
              className={cn(inputBase, errors.cvv && 'border-red-500 focus-visible:ring-red-500')}
            />
            {errors.cvv && <p className="mt-1.5 text-xs text-red-500">{errors.cvv}</p>}
          </div>
        </div>
      </div>

      {/* Seguridad */}
      <div className="flex items-center gap-2 mt-6 p-4 bg-surface border border-border">
        <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
        <p className="text-xs text-muted-foreground">
          Tu información de pago está protegida con encriptación SSL de 256 bits.
        </p>
      </div>

      <div className="flex items-center justify-between mt-8">
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
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-[var(--color-primary-hover)] disabled:opacity-60 text-white px-10 py-4 text-xs font-medium tracking-widest uppercase rounded-none transition-colors flex items-center gap-3"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Procesando…
            </>
          ) : (
            'Confirmar pedido'
          )}
        </button>
      </div>
    </form>
  )
}
