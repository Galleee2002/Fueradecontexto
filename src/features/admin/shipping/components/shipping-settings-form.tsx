'use client'

import { useState, useTransition } from 'react'
import { Save } from 'lucide-react'
import { saveCorreoArgentinoSettings } from '../actions/shipping-settings-actions'
import type { AdminShippingProviderSettings } from '../types'

interface ShippingSettingsFormProps {
  settings: AdminShippingProviderSettings | null
}

export function ShippingSettingsForm({ settings }: ShippingSettingsFormProps) {
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState('')
  const [savedMessage, setSavedMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const [customerId, setCustomerId] = useState(settings?.customerId ?? '')
  const [originPostalCode, setOriginPostalCode] = useState(settings?.originPostalCode ?? '')
  const [senderName, setSenderName] = useState(settings?.senderName ?? '')
  const [senderEmail, setSenderEmail] = useState(settings?.senderEmail ?? '')
  const [senderPhone, setSenderPhone] = useState(settings?.senderPhone ?? '')
  const [senderStreet, setSenderStreet] = useState(settings?.senderStreet ?? '')
  const [senderStreetNumber, setSenderStreetNumber] = useState(settings?.senderStreetNumber ?? '')
  const [senderFloor, setSenderFloor] = useState(settings?.senderFloor ?? '')
  const [senderApartment, setSenderApartment] = useState(settings?.senderApartment ?? '')
  const [senderCity, setSenderCity] = useState(settings?.senderCity ?? '')
  const [senderProvinceCode, setSenderProvinceCode] = useState(settings?.senderProvinceCode ?? '')
  const [senderPostalCode, setSenderPostalCode] = useState(settings?.senderPostalCode ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError('')
    setSavedMessage('')
    setErrors({})

    startTransition(async () => {
      const result = await saveCorreoArgentinoSettings({
        customerId,
        originPostalCode,
        senderName,
        senderEmail,
        senderPhone,
        senderStreet,
        senderStreetNumber,
        senderFloor,
        senderApartment,
        senderCity,
        senderProvinceCode: senderProvinceCode.toUpperCase(),
        senderPostalCode,
      })

      if ('error' in result) {
        setErrors(result.error.fieldErrors as Record<string, string[]>)
        const formErrors = result.error.formErrors
        if (formErrors?.length) setServerError(formErrors[0] ?? '')
        return
      }

      setSavedMessage('Configuración guardada.')
    })
  }

  function fieldClass(hasError: boolean) {
    return `w-full px-3 py-2.5 border bg-background text-sm focus:outline-none focus:ring-1 rounded-none ${
      hasError
        ? 'border-error focus:border-error focus:ring-error'
        : 'border-border focus:border-primary focus:ring-primary'
    }`
  }

  function renderError(field: string) {
    const message = errors[field]?.[0]
    return message ? <p className="mt-1 text-xs text-error">{message}</p> : null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div className="border border-border bg-background p-6 space-y-6">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Envíos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configuración operativa de Correo Argentino. Las credenciales sensibles siguen en variables de entorno.
          </p>
        </div>

        {serverError ? (
          <div className="border border-error-border bg-error-subtle px-4 py-3 text-sm text-error-foreground">
            {serverError}
          </div>
        ) : null}

        {savedMessage ? (
          <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {savedMessage}
          </div>
        ) : null}

        <section className="space-y-4">
          <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground">
            Cuenta MiCorreo
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-xs tracking-widest uppercase text-muted-foreground">
                Customer ID
              </label>
              <input
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                inputMode="numeric"
                autoComplete="off"
                className={fieldClass(!!errors.customerId)}
              />
              <p className="mt-1 text-xs text-muted-foreground">Se guarda normalizado a 10 dígitos.</p>
              {renderError('customerId')}
            </div>

            <div>
              <label className="mb-2 block text-xs tracking-widest uppercase text-muted-foreground">
                Código postal de origen
              </label>
              <input value={originPostalCode} onChange={(e) => setOriginPostalCode(e.target.value)} className={fieldClass(!!errors.originPostalCode)} />
              {renderError('originPostalCode')}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground">
            Remitente
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-xs tracking-widest uppercase text-muted-foreground">Nombre</label>
              <input value={senderName} onChange={(e) => setSenderName(e.target.value)} className={fieldClass(!!errors.senderName)} />
              {renderError('senderName')}
            </div>

            <div>
              <label className="mb-2 block text-xs tracking-widest uppercase text-muted-foreground">Email</label>
              <input value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} className={fieldClass(!!errors.senderEmail)} />
              {renderError('senderEmail')}
            </div>

            <div>
              <label className="mb-2 block text-xs tracking-widest uppercase text-muted-foreground">Teléfono</label>
              <input value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} className={fieldClass(!!errors.senderPhone)} />
              {renderError('senderPhone')}
            </div>

            <div>
              <label className="mb-2 block text-xs tracking-widest uppercase text-muted-foreground">Ciudad</label>
              <input value={senderCity} onChange={(e) => setSenderCity(e.target.value)} className={fieldClass(!!errors.senderCity)} />
              {renderError('senderCity')}
            </div>

            <div>
              <label className="mb-2 block text-xs tracking-widest uppercase text-muted-foreground">Calle</label>
              <input value={senderStreet} onChange={(e) => setSenderStreet(e.target.value)} className={fieldClass(!!errors.senderStreet)} />
              {renderError('senderStreet')}
            </div>

            <div>
              <label className="mb-2 block text-xs tracking-widest uppercase text-muted-foreground">Altura</label>
              <input value={senderStreetNumber} onChange={(e) => setSenderStreetNumber(e.target.value)} className={fieldClass(!!errors.senderStreetNumber)} />
              {renderError('senderStreetNumber')}
            </div>

            <div>
              <label className="mb-2 block text-xs tracking-widest uppercase text-muted-foreground">Piso</label>
              <input value={senderFloor} onChange={(e) => setSenderFloor(e.target.value)} className={fieldClass(!!errors.senderFloor)} />
              {renderError('senderFloor')}
            </div>

            <div>
              <label className="mb-2 block text-xs tracking-widest uppercase text-muted-foreground">Departamento</label>
              <input value={senderApartment} onChange={(e) => setSenderApartment(e.target.value)} className={fieldClass(!!errors.senderApartment)} />
              {renderError('senderApartment')}
            </div>

            <div>
              <label className="mb-2 block text-xs tracking-widest uppercase text-muted-foreground">Provincia (código)</label>
              <input
                value={senderProvinceCode}
                onChange={(e) => setSenderProvinceCode(e.target.value.toUpperCase())}
                maxLength={1}
                className={fieldClass(!!errors.senderProvinceCode)}
              />
              {renderError('senderProvinceCode')}
            </div>

            <div>
              <label className="mb-2 block text-xs tracking-widest uppercase text-muted-foreground">Código postal</label>
              <input value={senderPostalCode} onChange={(e) => setSenderPostalCode(e.target.value)} className={fieldClass(!!errors.senderPostalCode)} />
              {renderError('senderPostalCode')}
            </div>
          </div>
        </section>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs font-medium tracking-widest uppercase text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isPending ? 'Guardando…' : 'Guardar configuración'}
        </button>
      </div>
    </form>
  )
}
