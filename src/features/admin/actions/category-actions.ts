'use server'

import { revalidatePath } from 'next/cache'
import { sql } from '@/lib/db/client'
import { assertAdminSession } from '@/lib/auth/require-admin'

function revalidateAll() {
  revalidatePath('/admin/categorias')
  revalidatePath('/(site)', 'layout')
  revalidatePath('/productos')
  revalidatePath('/')
}

export async function createCategory(name: string) {
  await assertAdminSession()
  const trimmed = name.trim()
  if (!trimmed) return { error: 'El nombre no puede estar vacío.' }
  if (trimmed.length > 60) return { error: 'Máximo 60 caracteres.' }

  const existing = await sql`SELECT 1 FROM "Category" WHERE lower(name) = lower(${trimmed}) LIMIT 1`
  if (existing.length > 0) return { error: 'Ya existe una categoría con ese nombre.' }

  const id = crypto.randomUUID()
  await sql`INSERT INTO "Category" (id, name) VALUES (${id}, ${trimmed})`
  revalidateAll()
  return { success: true }
}

export async function renameCategory(oldName: string, newName: string) {
  await assertAdminSession()
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
  await assertAdminSession()
  // Products lose their category (set to empty string) — admin can reassign later
  await sql`UPDATE "Product" SET category = '', subcategory = '', "updatedAt" = NOW() WHERE category = ${name}`
  await sql`DELETE FROM "Category" WHERE name = ${name}`
  revalidateAll()
  revalidatePath('/admin/productos')
  return { success: true }
}

export async function addSubcategory(categoryName: string, subcategoryName: string) {
  await assertAdminSession()
  const trimmed = subcategoryName.trim()
  if (!trimmed) return { error: 'El nombre no puede estar vacío.' }
  if (trimmed.length > 60) return { error: 'Máximo 60 caracteres.' }

  const row = await sql`SELECT subcategories FROM "Category" WHERE name = ${categoryName} LIMIT 1`
  if (row.length === 0) return { error: 'Categoría no encontrada.' }

  const existing: string[] = row[0]!.subcategories as string[]
  const duplicate = existing.some((s) => s.toLowerCase() === trimmed.toLowerCase())
  if (duplicate) return { error: 'Ya existe una subcategoría con ese nombre.' }

  await sql`UPDATE "Category" SET subcategories = subcategories || ${JSON.stringify([trimmed])}::jsonb WHERE name = ${categoryName}`
  revalidatePath('/admin/categorias')
  return { success: true }
}

export async function renameSubcategory(categoryName: string, oldName: string, newName: string) {
  await assertAdminSession()
  const trimmed = newName.trim()
  if (!trimmed) return { error: 'El nombre no puede estar vacío.' }
  if (trimmed.length > 60) return { error: 'Máximo 60 caracteres.' }
  if (trimmed === oldName) return { success: true }

  const row = await sql`SELECT subcategories FROM "Category" WHERE name = ${categoryName} LIMIT 1`
  if (row.length === 0) return { error: 'Categoría no encontrada.' }

  const existing: string[] = row[0]!.subcategories as string[]
  const duplicate = existing.some((s) => s.toLowerCase() === trimmed.toLowerCase() && s !== oldName)
  if (duplicate) return { error: 'Ya existe una subcategoría con ese nombre.' }

  const updated = existing.map((s) => (s === oldName ? trimmed : s))
  await sql`UPDATE "Category" SET subcategories = ${JSON.stringify(updated)}::jsonb WHERE name = ${categoryName}`
  await sql`UPDATE "Product" SET subcategory = ${trimmed}, "updatedAt" = NOW() WHERE category = ${categoryName} AND subcategory = ${oldName}`

  revalidatePath('/admin/categorias')
  return { success: true }
}

export async function deleteSubcategory(categoryName: string, subcategoryName: string) {
  await assertAdminSession()

  const row = await sql`SELECT subcategories FROM "Category" WHERE name = ${categoryName} LIMIT 1`
  if (row.length === 0) return { error: 'Categoría no encontrada.' }

  const existing: string[] = row[0]!.subcategories as string[]
  const updated = existing.filter((s) => s !== subcategoryName)
  await sql`UPDATE "Category" SET subcategories = ${JSON.stringify(updated)}::jsonb WHERE name = ${categoryName}`
  await sql`UPDATE "Product" SET subcategory = '', "updatedAt" = NOW() WHERE category = ${categoryName} AND subcategory = ${subcategoryName}`

  revalidatePath('/admin/categorias')
  return { success: true }
}
