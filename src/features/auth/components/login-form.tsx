'use client'

import { useRef, useState } from 'react'
import { loginAction } from '../actions/auth-actions'

interface LoginFormProps {
  redirectTo?: string
}

export function LoginForm({ redirectTo = '/cuenta' }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const result = await loginAction(formData)

    // If result is undefined, a redirect is happening (login succeeded)
    if (result && 'error' in result) {
      setError(result.error)
      setLoading(false)
      formRef.current?.querySelector<HTMLInputElement>('input')?.focus()
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="brand-panel-solid space-y-6 px-6 py-7 sm:px-8" noValidate>
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="space-y-1">
        <p className="brand-kicker">Cuenta</p>
        <h2 className="text-4xl font-medium tracking-[-0.05em]">Iniciar sesión</h2>
        <p className="text-sm text-muted-foreground">
          Ingresá a tu cuenta para ver tus pedidos.
        </p>
      </div>

      {error && (
        <p
          className="text-sm text-error-foreground border border-error-border bg-error-subtle px-4 py-3"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}

      <div className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-medium tracking-wide uppercase">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            spellCheck={false}
            className="brand-input"
            placeholder="tu@email.com…"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-xs font-medium tracking-wide uppercase">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="brand-input"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="brand-button-primary w-full disabled:opacity-50"
      >
        {loading ? 'Ingresando…' : 'Ingresar'}
      </button>
    </form>
  )
}
