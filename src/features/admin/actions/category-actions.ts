'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { sql } from '@/lib/db/client'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
}

function revalidateAll() {
  revalidatePath('/admin/categorias')
  revalidatePath('/(site)', 'layout')
  revalidatePath('/productos')
  revalidatePath('/')
}

export async function createCategory(name: string) {
  await requireAdmin()
  const trimmed = name.trim()
  if (!trimmed) return { error: 'El nombre no puede estar vacío.' }
  if (trimmed.length > 60) return { error: 'Máximo 60 caracteres.' }

  const existing = await sql`SELECT 1 FROM "Category" WHERE lower(name) = lower(${trimmed}) LIMIT 1`
  if (existing.length > 0) return { error: 'Ya existe una categoría con ese nombre.' }

  await sql`INSERT INTO "Category" (name) VALUES (${trimmed})`
  revalidateAll()
  return { success: true }
}

export async function renameCategory(oldName: string, newName: string) {
  await requireAdmin()
  const trimmed = newName.trim()
  if (!trimmed) return { error: 'El nombre no puede estar vacío.' }
  if (trimmed.length > 60) return { error: 'Máximo 60 caracteres.' }
  if (trimmed === oldName) return { success: true }

  const existing = await sql`SELECT 1 FROM "Category" WHERE lower(name) = lower(${trimmed}) AND name != ${oldName} LIMIT 1`
  if (existing.length > 0) return { error: 'Ya existe una categoría con ese nombre.' }

  // Rename in Category table and cascade to all products
  await sql`UPDATE "Category" SET name = ${trimmed} WHERE name = ${oldName}`
  await sql`UPDATE "Product" SET category = ${trimmed}, "updatedAt" = NOW() WHERE category = ${oldName}`

  revalidateAll()
  revalidatePath('/admin/productos')
  return { success: true }
}

export async function deleteCategory(name: string) {
  await requireAdmin()
  // Products lose their category (set to empty string) — admin can reassign later
  await sql`UPDATE "Product" SET category = '', "updatedAt" = NOW() WHERE category = ${name}`
  await sql`DELETE FROM "Category" WHERE name = ${name}`
  revalidateAll()
  revalidatePath('/admin/productos')
  return { success: true }
}
