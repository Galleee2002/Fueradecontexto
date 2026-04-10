'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { z } from 'zod'
import { cn } from '@/shared/lib/cn'
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
  'w-full border border-border bg-background px-4 py-3 text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 rounded-none transition-colors'

const labelBase = 'block text-xs tracking-widest uppercase text-muted-foreground mb-2'

export function StepContact({ defaultValues, onNext }: StepContactProps) {
  const formRef = useRef<HTMLFormElement>(null)
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
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      })
      return
    }

    onNext(result.data)
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <h2 className="font-serif text-2xl mb-8">Datos de contacto</h2>

      <div className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className={labelBase}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            spellCheck={false}
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="tu@email.com…"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className={cn(inputBase, errors.email && 'border-error focus-visible:ring-error')}
          />
          {errors.email && <p id="contact-email-error" className="mt-1.5 text-xs text-error" role="alert">{errors.email}</p>}
        </div>

        {/* Nombre + Apellido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nombre" className={labelBase}>
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              autoComplete="given-name"
              value={values.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Juan"
              aria-invalid={Boolean(errors.nombre)}
              aria-describedby={errors.nombre ? 'contact-nombre-error' : undefined}
              className={cn(inputBase, errors.nombre && 'border-error focus-visible:ring-error')}
            />
            {errors.nombre && <p id="contact-nombre-error" className="mt-1.5 text-xs text-error" role="alert">{errors.nombre}</p>}
          </div>

          <div>
            <label htmlFor="apellido" className={labelBase}>
              Apellido
            </label>
            <input
              id="apellido"
              name="apellido"
              type="text"
              autoComplete="family-name"
              value={values.apellido}
              onChange={(e) => handleChange('apellido', e.target.value)}
              placeholder="García"
              aria-invalid={Boolean(errors.apellido)}
              aria-describedby={errors.apellido ? 'contact-apellido-error' : undefined}
              className={cn(inputBase, errors.apellido && 'border-error focus-visible:ring-error')}
            />
            {errors.apellido && <p id="contact-apellido-error" className="mt-1.5 text-xs text-error" role="alert">{errors.apellido}</p>}
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="telefono" className={labelBase}>
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            autoComplete="tel"
            value={values.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            placeholder="+54 9 11 1234-5678…"
            aria-invalid={Boolean(errors.telefono)}
            aria-describedby={errors.telefono ? 'contact-telefono-error' : undefined}
            className={cn(inputBase, errors.telefono && 'border-error focus-visible:ring-error')}
          />
          {errors.telefono && <p id="contact-telefono-error" className="mt-1.5 text-xs text-error" role="alert">{errors.telefono}</p>}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 mt-10">
        <button
          type="submit"
          className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-primary-foreground px-10 py-4 text-xs font-medium tracking-widest uppercase rounded-none transition-colors"
        >
          Continuar
        </button>
      </div>

      <p className="mt-6 text-xs text-muted-foreground text-center">
        Al continuar aceptás nuestros{' '}
        <Link href="/legal/terminos" className="underline underline-offset-2 hover:text-foreground transition-colors">
          Términos y condiciones
        </Link>
      </p>
    </form>
  )
}
