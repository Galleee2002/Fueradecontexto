'use server'

import { revalidatePath } from 'next/cache'
import { sql } from '@/lib/db/client'
import { assertAdminSession } from '@/lib/auth/require-admin'

function revalidateAll() {
  revalidatePath('/admin/colores')
  revalidatePath('/admin/productos')
}

export async function createColor(name: string, hex: string) {
  await assertAdminSession()
  const trimmed = name.trim()
  if (!trimmed) return { error: 'El nombre no puede estar vacío.' }
  if (trimmed.length > 60) return { error: 'Máximo 60 caracteres.' }
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return { error: 'Color HEX inválido.' }

  const existing = await sql`SELECT 1 FROM "Color" WHERE lower(name) = lower(${trimmed}) LIMIT 1`
  if (existing.length > 0) return { error: 'Ya existe un color con ese nombre.' }

  await sql`INSERT INTO "Color" (id, name, hex) VALUES (gen_random_uuid(), ${trimmed}, ${hex.toUpperCase()})`
  revalidateAll()
  return { success: true }
}

export async function updateColor(id: string, name: string, hex: string) {
  await assertAdminSession()
  const trimmed = name.trim()
  if (!trimmed) return { error: 'El nombre no puede estar vacío.' }
  if (trimmed.length > 60) return { error: 'Máximo 60 caracteres.' }
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return { error: 'Color HEX inválido.' }

  const existing = await sql`SELECT 1 FROM "Color" WHERE lower(name) = lower(${trimmed}) AND id != ${id} LIMIT 1`
  if (existing.length > 0) return { error: 'Ya existe un color con ese nombre.' }

  await sql`UPDATE "Color" SET name = ${trimmed}, hex = ${hex.toUpperCase()} WHERE id = ${id}`
  revalidateAll()
  return { success: true }
}

export async function deleteColor(id: string) {
  await assertAdminSession()
  await sql`DELETE FROM "Color" WHERE id = ${id}`
  revalidateAll()
  return { success: true }
}
