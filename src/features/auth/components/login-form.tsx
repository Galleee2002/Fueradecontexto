'use client'

import { useRef, useState } from 'react'
import { loginAction } from '../actions/auth-actions'

export function LoginForm() {
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
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-1">
        <h2 className="text-4xl font-normal font-serif">Iniciar sesión</h2>
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
            className="w-full border border-border px-4 py-3 text-sm rounded-none focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground"
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
            className="w-full border border-border px-4 py-3 text-sm rounded-none focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50 rounded-none px-8 py-4 text-sm font-medium tracking-widest uppercase transition-colors w-full"
      >
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  )
}
