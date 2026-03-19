'use server'

import { revalidatePath } from 'next/cache'
import { sql } from '@/lib/db/client'

function revalidateAll() {
  revalidatePath('/admin/categorias')
  revalidatePath('/(site)', 'layout')
  revalidatePath('/productos')
  revalidatePath('/')
}

export async function createCategory(name: string) {
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
  // Products lose their category (set to empty string) — admin can reassign later
  await sql`UPDATE "Product" SET category = '', "updatedAt" = NOW() WHERE category = ${name}`
  await sql`DELETE FROM "Category" WHERE name = ${name}`
  revalidateAll()
  revalidatePath('/admin/productos')
  return { success: true }
}
