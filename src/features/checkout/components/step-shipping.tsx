'use client'

import { useState } from 'react'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { ShippingData } from '../types'

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

const shippingSchema = z.object({
  calle: z.string().min(1, 'La calle es requerida'),
  numero: z.string().min(1, 'El número es requerido'),
  pisoDpto: z.string(),
  ciudad: z.string().min(1, 'La ciudad es requerida'),
  provincia: z.string().min(1, 'La provincia es requerida'),
  codigoPostal: z.string().min(4, 'El código postal es requerido'),
})

type FormErrors = Partial<Record<keyof ShippingData, string>>

interface StepShippingProps {
  defaultValues: ShippingData | null
  onNext: (data: ShippingData) => void
  onBack: () => void
}

const inputBase =
  'w-full border border-border bg-background px-4 py-3 text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 rounded-none transition-colors'

const labelBase = 'block text-xs tracking-widest uppercase text-muted-foreground mb-2'

export function StepShipping({ defaultValues, onNext, onBack }: StepShippingProps) {
  const [values, setValues] = useState<ShippingData>({
    calle: defaultValues?.calle ?? '',
    numero: defaultValues?.numero ?? '',
    pisoDpto: defaultValues?.pisoDpto ?? '',
    ciudad: defaultValues?.ciudad ?? '',
    provincia: defaultValues?.provincia ?? '',
    codigoPostal: defaultValues?.codigoPostal ?? '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  function handleChange(field: keyof ShippingData, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = shippingSchema.safeParse(values)

    if (!result.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ShippingData
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    onNext(result.data)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="font-serif text-2xl mb-8">Dirección de envío</h2>

      <div className="space-y-6">
        {/* Calle + Número */}
        <div className="grid grid-cols-[1fr_120px] gap-4">
          <div>
            <label htmlFor="calle" className={labelBase}>
              Calle
            </label>
            <input
              id="calle"
              type="text"
              autoComplete="address-line1"
              value={values.calle}
              onChange={(e) => handleChange('calle', e.target.value)}
              placeholder="Av. Corrientes"
              className={cn(inputBase, errors.calle && 'border-error focus-visible:ring-error')}
            />
            {errors.calle && <p className="mt-1.5 text-xs text-error">{errors.calle}</p>}
          </div>

          <div>
            <label htmlFor="numero" className={labelBase}>
              Número
            </label>
            <input
              id="numero"
              type="text"
              value={values.numero}
              onChange={(e) => handleChange('numero', e.target.value)}
              placeholder="1234"
              className={cn(inputBase, errors.numero && 'border-error focus-visible:ring-error')}
            />
            {errors.numero && <p className="mt-1.5 text-xs text-error">{errors.numero}</p>}
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
            type="text"
            autoComplete="address-line2"
            value={values.pisoDpto}
            onChange={(e) => handleChange('pisoDpto', e.target.value)}
            placeholder="3° B"
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
              type="text"
              autoComplete="address-level2"
              value={values.ciudad}
              onChange={(e) => handleChange('ciudad', e.target.value)}
              placeholder="Buenos Aires"
              className={cn(inputBase, errors.ciudad && 'border-error focus-visible:ring-error')}
            />
            {errors.ciudad && <p className="mt-1.5 text-xs text-error">{errors.ciudad}</p>}
          </div>

          <div>
            <label htmlFor="codigoPostal" className={labelBase}>
              Código Postal
            </label>
            <input
              id="codigoPostal"
              type="text"
              autoComplete="postal-code"
              value={values.codigoPostal}
              onChange={(e) => handleChange('codigoPostal', e.target.value)}
              placeholder="C1043"
              className={cn(inputBase, errors.codigoPostal && 'border-error focus-visible:ring-error')}
            />
            {errors.codigoPostal && (
              <p className="mt-1.5 text-xs text-error">{errors.codigoPostal}</p>
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
            value={values.provincia}
            onChange={(e) => handleChange('provincia', e.target.value)}
            className={cn(
              inputBase,
              'cursor-pointer appearance-none',
              errors.provincia && 'border-error focus-visible:ring-error',
              values.provincia === '' && 'text-muted-foreground'
            )}
          >
            <option value="" disabled>
              Seleccioná tu provincia
            </option>
            {PROVINCIAS.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
          {errors.provincia && <p className="mt-1.5 text-xs text-error">{errors.provincia}</p>}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 mt-10">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        <button
          type="submit"
          className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-primary-foreground px-10 py-4 text-xs font-medium tracking-widest uppercase rounded-none transition-colors"
        >
          Continuar
        </button>
      </div>
    </form>
  )
}
