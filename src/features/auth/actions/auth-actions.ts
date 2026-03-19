'use server'

import { z } from 'zod'
import { AuthError } from 'next-auth'
import { signIn, signOut } from '@/auth'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: 'Credenciales inválidas' }
  }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: '/admin',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Email o contraseña incorrectos' }
    }
    throw error // Re-throw redirect (NEXT_REDIRECT)
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/' })
}
