'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import type { ShippingData, ShippingFormErrors } from '../types'
import { shippingSchema } from '../schemas/checkout-schema'

const PROVINCIAS = [
  'Buenos Aires',
  'Ciudad Autónoma de Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
]

interface StepShippingProps {
  defaultValues: ShippingData | null
  serverErrors?: ShippingFormErrors
  onNext: (data: ShippingData) => void
  onBack: () => void
}

const inputBase =
  'brand-input text-base sm:text-sm'

const labelBase = 'mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted-foreground'

export function StepShipping({ defaultValues, serverErrors, onNext, onBack }: StepShippingProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState<ShippingData>({
    calle: defaultValues?.calle ?? '',
    numero: defaultValues?.numero ?? '',
    pisoDpto: defaultValues?.pisoDpto ?? '',
    ciudad: defaultValues?.ciudad ?? '',
    provincia: defaultValues?.provincia ?? '',
    codigoPostal: defaultValues?.codigoPostal ?? '',
  })
  const [clientErrors, setClientErrors] = useState<ShippingFormErrors>({})
  const [dismissedServerErrors, setDismissedServerErrors] = useState<Partial<Record<keyof ShippingData, true>>>({})

  useEffect(() => {
    if (!serverErrors || Object.keys(serverErrors).length === 0) {
      return
    }

    requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    })
  }, [serverErrors])

  const errors: ShippingFormErrors = {
    ...Object.fromEntries(
      Object.entries(serverErrors ?? {}).filter(([key]) => !dismissedServerErrors[key as keyof ShippingData]),
    ),
    ...clientErrors,
  }

  function handleChange(field: keyof ShippingData, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setClientErrors((prev) => ({ ...prev, [field]: undefined }))
      setDismissedServerErrors((prev) => ({ ...prev, [field]: true }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = shippingSchema.safeParse(values)

    if (!result.success) {
      const fieldErrors: ShippingFormErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ShippingData
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setClientErrors(fieldErrors)
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      })
      return
    }

    onNext(result.data)
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className="mb-8 space-y-2">
        <p className="brand-kicker">Paso 2</p>
        <h2 className="text-3xl font-medium tracking-[-0.05em]">Dirección de envío</h2>
      </div>

      <div className="space-y-6">
        {/* Calle + Número */}
        <div className="grid grid-cols-[1fr_120px] gap-4">
          <div>
            <label htmlFor="calle" className={labelBase}>
              Calle
            </label>
            <input
              id="calle"
              name="calle"
              type="text"
              autoComplete="address-line1"
              value={values.calle}
              onChange={(e) => handleChange('calle', e.target.value)}
              placeholder="Av. Corrientes…"
              aria-invalid={Boolean(errors.calle)}
              aria-describedby={errors.calle ? 'shipping-calle-error' : undefined}
              className={cn(inputBase, errors.calle && 'border-error focus-visible:ring-error')}
            />
            {errors.calle && <p id="shipping-calle-error" className="mt-1.5 text-xs text-error" role="alert">{errors.calle}</p>}
          </div>

          <div>
            <label htmlFor="numero" className={labelBase}>
              Número
            </label>
            <input
              id="numero"
              name="numero"
              type="text"
              value={values.numero}
              onChange={(e) => handleChange('numero', e.target.value)}
              placeholder="1234…"
              aria-invalid={Boolean(errors.numero)}
              aria-describedby={errors.numero ? 'shipping-numero-error' : undefined}
              className={cn(inputBase, errors.numero && 'border-error focus-visible:ring-error')}
            />
            {errors.numero && <p id="shipping-numero-error" className="mt-1.5 text-xs text-error" role="alert">{errors.numero}</p>}
          </div>
        </div>

        {/* Piso / Dpto */}
        <div>
          <label htmlFor="pisoDpto" className={labelBase}>
            Piso / Dpto{' '}
            <span className="normal-case tracking-normal font-normal">(opcional)</span>
          </label>
          <input
            id="pisoDpto"
            name="pisoDpto"
            type="text"
            autoComplete="address-line2"
            value={values.pisoDpto}
            onChange={(e) => handleChange('pisoDpto', e.target.value)}
            placeholder="3° B…"
            className={inputBase}
          />
        </div>

        {/* Ciudad + CP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="ciudad" className={labelBase}>
              Ciudad
            </label>
            <input
              id="ciudad"
              name="ciudad"
              type="text"
              autoComplete="address-level2"
              value={values.ciudad}
              onChange={(e) => handleChange('ciudad', e.target.value)}
              placeholder="Buenos Aires…"
              aria-invalid={Boolean(errors.ciudad)}
              aria-describedby={errors.ciudad ? 'shipping-ciudad-error' : undefined}
              className={cn(inputBase, errors.ciudad && 'border-error focus-visible:ring-error')}
            />
            {errors.ciudad && <p id="shipping-ciudad-error" className="mt-1.5 text-xs text-error" role="alert">{errors.ciudad}</p>}
          </div>

          <div>
            <label htmlFor="codigoPostal" className={labelBase}>
              Código Postal
            </label>
            <input
              id="codigoPostal"
              name="codigoPostal"
              type="text"
              autoComplete="postal-code"
              value={values.codigoPostal}
              onChange={(e) => handleChange('codigoPostal', e.target.value)}
              placeholder="1414 o C1414ABC"
              aria-invalid={Boolean(errors.codigoPostal)}
              aria-describedby={errors.codigoPostal ? 'shipping-cp-error' : undefined}
              className={cn(inputBase, errors.codigoPostal && 'border-error focus-visible:ring-error')}
            />
            {errors.codigoPostal && (
              <p id="shipping-cp-error" className="mt-1.5 text-xs text-error" role="alert">{errors.codigoPostal}</p>
            )}
          </div>
        </div>

        {/* Provincia */}
        <div>
          <label htmlFor="provincia" className={labelBase}>
            Provincia
          </label>
          <select
            id="provincia"
            name="provincia"
            value={values.provincia}
            onChange={(e) => handleChange('provincia', e.target.value)}
            aria-invalid={Boolean(errors.provincia)}
            aria-describedby={errors.provincia ? 'shipping-provincia-error' : undefined}
            className={cn(
              inputBase,
              'cursor-pointer appearance-none',
              errors.provincia && 'border-error focus-visible:ring-error',
              values.provincia === '' && 'text-muted-foreground'
            )}
          >
            <option value="" disabled>
              Seleccioná tu provincia…
            </option>
            {PROVINCIAS.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
          {errors.provincia && <p id="shipping-provincia-error" className="mt-1.5 text-xs text-error" role="alert">{errors.provincia}</p>}
        </div>
      </div>

      <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        <button
          type="submit"
          className="brand-button-primary w-full sm:w-auto"
        >
          Continuar
        </button>
      </div>
    </form>
  )
}
