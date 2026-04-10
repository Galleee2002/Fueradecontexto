'use server'

import { revalidatePath } from 'next/cache'
import { sql } from '@/shared/infrastructure/db/client'
import { assertAdminSession } from '@/shared/infrastructure/auth/require-admin'

export async function createStampLocation(
  name: string,
): Promise<{ success: true; name: string } | { error: string }> {
  await assertAdminSession()

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
