'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const loginSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  // Auth logic will be implemented here
  revalidatePath('/')
  return { success: true }
}

export async function logoutAction() {
  // Logout logic will be implemented here
  revalidatePath('/')
}
