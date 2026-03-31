'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { sql } from '@/lib/db/client'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
}

export async function createStampLocation(
  name: string,
): Promise<{ success: true; name: string } | { error: string }> {
  await requireAdmin()

  const trimmed = name.trim()
  if (!trimmed) return { error: 'El nombre no puede estar vacío.' }
  if (trimmed.length > 60) return { error: 'Máximo 60 caracteres.' }

  const existing = await sql`
    SELECT 1 FROM "StampLocation" WHERE lower(name) = lower(${trimmed}) LIMIT 1
  `
  if (existing.length > 0) return { error: 'Ya existe una ubicación con ese nombre.' }

  const id = crypto.randomUUID()
  await sql`
    INSERT INTO "StampLocation" (id, name, "createdAt")
    VALUES (${id}, ${trimmed}, NOW())
  `

  revalidatePath('/admin/productos/nuevo')
  revalidatePath('/admin/productos/[id]', 'page')
  return { success: true, name: trimmed }
}
