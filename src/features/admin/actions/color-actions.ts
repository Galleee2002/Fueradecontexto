'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { sql } from '@/lib/db/client'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
}

function revalidateAll() {
  revalidatePath('/admin/colores')
  revalidatePath('/admin/productos')
}

export async function createColor(name: string, hex: string) {
  await requireAdmin()
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
  await requireAdmin()
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
  await requireAdmin()
  await sql`DELETE FROM "Color" WHERE id = ${id}`
  revalidateAll()
  return { success: true }
}
