'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, MapPin, Package } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { loadNearbyAgencies, type NearbyAgencyOption } from '../actions/checkout-actions'
import type { FulfillmentMethod, ShippingData, ShippingFormErrors } from '../types'
import { shippingSchema } from '../schemas/checkout-schema'
import { SELLER_PICKUP_STREET_LINE, SELLER_PICKUP_CITY } from '../lib/seller-pickup'

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
    fulfillmentMethod: defaultValues?.fulfillmentMethod ?? 'correo_argentino',
    deliveryType: defaultValues?.deliveryType ?? 'D',
    calle: defaultValues?.calle ?? '',
    numero: defaultValues?.numero ?? '',
    pisoDpto: defaultValues?.pisoDpto ?? '',
    ciudad: defaultValues?.ciudad ?? '',
    provincia: defaultValues?.provincia ?? '',
    codigoPostal: defaultValues?.codigoPostal ?? '',
    agencyCode: defaultValues?.agencyCode ?? '',
    agencyName: defaultValues?.agencyName ?? '',
  })
  const [clientErrors, setClientErrors] = useState<ShippingFormErrors>({})
  const [dismissedServerErrors, setDismissedServerErrors] = useState<Partial<Record<keyof ShippingData, true>>>({})
  const [isLoadingAgencies, setIsLoadingAgencies] = useState(false)
  const [agencyOptions, setAgencyOptions] = useState<NearbyAgencyOption[]>([])
  const [suggestedAgencyOptions, setSuggestedAgencyOptions] = useState<NearbyAgencyOption[]>([])

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

  const visibleAgencyOptions = [
    ...suggestedAgencyOptions,
    ...agencyOptions.filter(
      (agency) => !suggestedAgencyOptions.some((suggested) => suggested.code === agency.code),
    ),
  ]

  function setFulfillmentMethod(method: FulfillmentMethod) {
    setValues((prev) => ({
      ...prev,
      fulfillmentMethod: method,
      ...(method === 'seller_pickup'
        ? { deliveryType: 'D' as const, agencyCode: '', agencyName: '' }
        : {}),
    }))
    setClientErrors((prev) => {
      const next = { ...prev }
      delete next.fulfillmentMethod
      return next
    })
  }

  function handleChange(field: keyof ShippingData, value: string) {
    setValues((prev) => {
      if (field === 'deliveryType') {
        return {
          ...prev,
          deliveryType: value as ShippingData['deliveryType'],
          agencyCode: '',
          agencyName: '',
        }
      }

      if (field === 'provincia' || field === 'codigoPostal' || field === 'ciudad') {
        return {
          ...prev,
          [field]: value,
          agencyCode: '',
          agencyName: '',
        }
      }

      return { ...prev, [field]: value }
    })
    if (errors[field]) {
      setClientErrors((prev) => ({ ...prev, [field]: undefined }))
      setDismissedServerErrors((prev) => ({ ...prev, [field]: true }))
    }
  }

  useEffect(() => {
    if (values.fulfillmentMethod !== 'correo_argentino') return
    if (values.deliveryType !== 'S' || !values.provincia.trim()) return

    let cancelled = false

    async function loadAgencies() {
      setIsLoadingAgencies(true)
      try {
        const result = await loadNearbyAgencies({
          provincia: values.provincia,
          codigoPostal: values.codigoPostal,
          ciudad: values.ciudad,
        })
        if (cancelled) return
        setAgencyOptions(result.all)
        setSuggestedAgencyOptions(result.suggested)
      } catch {
        if (cancelled) return
        setAgencyOptions([])
        setSuggestedAgencyOptions([])
      } finally {
        if (cancelled) return
        setIsLoadingAgencies(false)
      }
    }

    void loadAgencies()

    return () => {
      cancelled = true
    }
  }, [values.fulfillmentMethod, values.deliveryType, values.provincia, values.codigoPostal, values.ciudad])

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

  const isCorreo = values.fulfillmentMethod === 'correo_argentino'

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className="mb-8 space-y-2">
        <p className="brand-kicker">Paso 2</p>
        <h2 className="text-3xl font-medium tracking-[-0.05em]">Envío o retiro</h2>
        <p className="max-w-xl text-[17px] leading-relaxed text-muted-foreground">
          Elegí si preferís que te lo enviemos con Correo Argentino o si pasás a retirarlo por nuestro domicilio.
        </p>
      </div>

      <fieldset className="mb-8 space-y-3">
        <legend id="fulfillment-legend" className={labelBase}>
          Cómo recibís tu pedido
        </legend>
        <div
          role="radiogroup"
          aria-labelledby="fulfillment-legend"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <label
            className={cn(
              'relative flex min-h-[min(100%,11rem)] cursor-pointer flex-col gap-3 rounded-[1.125rem] border bg-background p-5 sm:p-6 transition-[border-color,box-shadow] duration-200',
              'has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-primary',
              values.fulfillmentMethod === 'correo_argentino'
                ? 'border-primary shadow-[0_0_0_1px_hsl(var(--primary))]'
                : 'border-border hover:border-foreground/20',
            )}
          >
            <input
              type="radio"
              name="fulfillmentMethod"
              value="correo_argentino"
              checked={values.fulfillmentMethod === 'correo_argentino'}
              onChange={() => setFulfillmentMethod('correo_argentino')}
              className="sr-only"
            />
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-foreground">
                <Package className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 text-left">
                <span className="block text-[17px] font-semibold leading-snug tracking-[-0.02em] text-foreground">
                  Correo Argentino
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  Envío a tu domicilio o retiro en sucursal del Correo. El costo se cotiza en el siguiente paso.
                </span>
              </span>
            </div>
          </label>

          <label
            className={cn(
              'relative flex min-h-[min(100%,11rem)] cursor-pointer flex-col gap-3 rounded-[1.125rem] border bg-background p-5 sm:p-6 transition-[border-color,box-shadow] duration-200',
              'has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-primary',
              values.fulfillmentMethod === 'seller_pickup'
                ? 'border-primary shadow-[0_0_0_1px_hsl(var(--primary))]'
                : 'border-border hover:border-foreground/20',
            )}
          >
            <input
              type="radio"
              name="fulfillmentMethod"
              value="seller_pickup"
              checked={values.fulfillmentMethod === 'seller_pickup'}
              onChange={() => setFulfillmentMethod('seller_pickup')}
              className="sr-only"
            />
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-foreground">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 text-left">
                <span className="block text-[17px] font-semibold leading-snug tracking-[-0.02em] text-foreground">
                  Retiro en domicilio <span className="font-normal text-muted-foreground">(Domicilio)</span>
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  {SELLER_PICKUP_STREET_LINE}, {SELLER_PICKUP_CITY}. Sin costo de envío.
                </span>
              </span>
            </div>
          </label>
        </div>
        {errors.fulfillmentMethod ? (
          <p className="text-xs text-error" role="alert">
            {errors.fulfillmentMethod}
          </p>
        ) : null}
      </fieldset>

      <div className="space-y-6">
        {isCorreo ? (
          <>
        <div>
          <label htmlFor="deliveryType" className={labelBase}>
            Modalidad con Correo Argentino
          </label>
          <select
            id="deliveryType"
            name="deliveryType"
            value={values.deliveryType}
            onChange={(e) => handleChange('deliveryType', e.target.value as ShippingData['deliveryType'])}
            className={cn(inputBase, 'cursor-pointer appearance-none')}
          >
            <option value="D">Envío a tu domicilio</option>
            <option value="S">Retiro en sucursal (Correo Argentino)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px]">
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

        {values.deliveryType === 'S' ? (
          <div className="space-y-3">
            <div>
              <label htmlFor="agencyCode" className={labelBase}>
                Sucursal de retiro
              </label>
              <select
                id="agencyCode"
                name="agencyCode"
                value={values.agencyCode}
                onChange={(e) => {
                  const selected = visibleAgencyOptions.find((agency) => agency.code === e.target.value) ?? null
                  handleChange('agencyCode', selected?.code ?? '')
                  handleChange('agencyName', selected?.name ?? '')
                }}
                aria-invalid={Boolean(errors.agencyCode || errors.agencyName)}
                aria-describedby={errors.agencyCode ? 'shipping-agency-error' : undefined}
                className={cn(
                  inputBase,
                  'cursor-pointer appearance-none',
                  errors.agencyCode && 'border-error focus-visible:ring-error',
                )}
              >
                <option value="" disabled>
                  {isLoadingAgencies ? 'Cargando sucursales…' : 'Seleccioná una sucursal sugerida…'}
                </option>
                {visibleAgencyOptions.map((agency) => (
                  <option key={agency.code} value={agency.code}>
                    {agency.code} · {agency.name}
                    {agency.city ? ` · ${agency.city}` : ''}
                    {agency.province ? ` · ${agency.province}` : ''}
                  </option>
                ))}
              </select>
              {errors.agencyCode || errors.agencyName ? (
                <p id="shipping-agency-error" className="mt-1.5 text-xs text-error" role="alert">
                  {errors.agencyCode ?? errors.agencyName}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Mostramos primero hasta 10 sugerencias por cercanía estimada y luego el resto de sucursales de la provincia.
                </p>
              )}
            </div>
          </div>
        ) : null}
          </>
        ) : (
          <div className="rounded-[1.125rem] border border-border bg-surface px-5 py-6 sm:px-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Punto de retiro</p>
            <p className="mt-3 text-[17px] font-semibold leading-snug tracking-[-0.02em] text-foreground">
              {SELLER_PICKUP_STREET_LINE}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{SELLER_PICKUP_CITY}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Te avisamos por mail cuando el pedido esté listo para retirar. Coordinamos horario si hace falta.
            </p>
          </div>
        )}
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
