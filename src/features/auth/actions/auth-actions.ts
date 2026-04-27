'use server'

import { z } from 'zod'
import { AuthError } from 'next-auth'
import { headers } from 'next/headers'
import { signIn, signOut } from '@/auth'
import {
  getLoginRateLimitState,
  registerLoginFailure,
  resetLoginRateLimit,
} from '@/shared/infrastructure/security/login-rate-limit'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

function resolveRedirect(rawRedirect: FormDataEntryValue | null) {
  if (typeof rawRedirect !== 'string') return '/cuenta'
  if (!rawRedirect.startsWith('/')) return '/cuenta'
  if (rawRedirect.startsWith('//')) return '/cuenta'
  return rawRedirect
}

async function buildLoginRateLimitKey(formData: FormData) {
  const headerStore = await headers()
  const rawForwardedFor = headerStore.get('x-forwarded-for') ?? ''
  const forwardedIp = rawForwardedFor.split(',')[0]?.trim()
  const realIp = headerStore.get('x-real-ip')?.trim()
  const ip = forwardedIp || realIp || 'unknown'

  const rawEmail = formData.get('email')
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : 'unknown'

  return `${ip}:${email}`
}

export async function loginAction(formData: FormData) {
  const rateLimitKey = await buildLoginRateLimitKey(formData)
  const rateLimitState = getLoginRateLimitState(rateLimitKey)

  if (rateLimitState.blocked) {
    const waitMinutes = Math.max(1, Math.ceil(rateLimitState.retryAfterSeconds / 60))
    return {
      error: `Demasiados intentos. Esperá ${waitMinutes} minuto${waitMinutes === 1 ? '' : 's'} e intentá de nuevo.`,
    }
  }

  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    registerLoginFailure(rateLimitKey)
    return { error: 'Credenciales inválidas' }
  }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: resolveRedirect(formData.get('redirectTo')),
    })
  } catch (error) {
    if (error instanceof AuthError) {
      registerLoginFailure(rateLimitKey)
      return { error: 'Email o contraseña incorrectos' }
    }

    const isRedirectError =
      typeof error === 'object' &&
      error !== null &&
      'digest' in error &&
      typeof (error as { digest?: unknown }).digest === 'string' &&
      (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')

    if (isRedirectError) {
      resetLoginRateLimit(rateLimitKey)
    }

    throw error // Re-throw redirect (NEXT_REDIRECT)
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/' })
}
