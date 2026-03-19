'use client'

import { useState } from 'react'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { ContactData } from '../types'

const contactSchema = z.object({
  email: z.string().email('Email inválido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellido: z.string().min(1, 'El apellido es requerido'),
  telefono: z.string().min(6, 'El teléfono es requerido'),
})

type FormErrors = Partial<Record<keyof ContactData, string>>

interface StepContactProps {
  defaultValues: ContactData | null
  onNext: (data: ContactData) => void
}

const inputBase =
  'w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 rounded-none transition-colors'

const labelBase = 'block text-xs tracking-widest uppercase text-muted-foreground mb-2'

export function StepContact({ defaultValues, onNext }: StepContactProps) {
  const [values, setValues] = useState<ContactData>({
    email: defaultValues?.email ?? '',
    nombre: defaultValues?.nombre ?? '',
    apellido: defaultValues?.apellido ?? '',
    telefono: defaultValues?.telefono ?? '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  function handleChange(field: keyof ContactData, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = contactSchema.safeParse(values)

    if (!result.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ContactData
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    onNext(result.data)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="font-serif text-2xl mb-8">Datos de contacto</h2>

      <div className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className={labelBase}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="tu@email.com"
            className={cn(inputBase, errors.email && 'border-red-500 focus-visible:ring-red-500')}
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Nombre + Apellido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nombre" className={labelBase}>
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              autoComplete="given-name"
              value={values.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Juan"
              className={cn(inputBase, errors.nombre && 'border-red-500 focus-visible:ring-red-500')}
            />
            {errors.nombre && <p className="mt-1.5 text-xs text-red-500">{errors.nombre}</p>}
          </div>

          <div>
            <label htmlFor="apellido" className={labelBase}>
              Apellido
            </label>
            <input
              id="apellido"
              type="text"
              autoComplete="family-name"
              value={values.apellido}
              onChange={(e) => handleChange('apellido', e.target.value)}
              placeholder="García"
              className={cn(inputBase, errors.apellido && 'border-red-500 focus-visible:ring-red-500')}
            />
            {errors.apellido && <p className="mt-1.5 text-xs text-red-500">{errors.apellido}</p>}
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="telefono" className={labelBase}>
            Teléfono
          </label>
          <input
            id="telefono"
            type="tel"
            autoComplete="tel"
            value={values.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            placeholder="+54 9 11 1234-5678"
            className={cn(inputBase, errors.telefono && 'border-red-500 focus-visible:ring-red-500')}
          />
          {errors.telefono && <p className="mt-1.5 text-xs text-red-500">{errors.telefono}</p>}
        </div>
      </div>

      <div className="flex items-center justify-end mt-10">
        <button
          type="submit"
          className="bg-primary hover:bg-[var(--color-primary-hover)] text-white px-10 py-4 text-xs font-medium tracking-widest uppercase rounded-none transition-colors"
        >
          Continuar
        </button>
      </div>

      <p className="mt-6 text-xs text-muted-foreground text-center">
        Al continuar aceptás nuestros{' '}
        <span className="underline underline-offset-2 cursor-pointer">Términos y condiciones</span>
      </p>
    </form>
  )
}
