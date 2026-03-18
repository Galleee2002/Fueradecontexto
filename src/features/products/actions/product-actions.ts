'use server'

import { revalidatePath } from 'next/cache'
import { sql } from '@/lib/db/client'
import { productSchema } from '../schemas/product-schema'
import type { ProductInput } from '../schemas/product-schema'

export async function createProduct(input: ProductInput) {
  const parsed = productSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  const { slug, name, description, price, imageUrl, category, active } = parsed.data

  await sql`
    INSERT INTO "Product" (slug, name, description, price, "imageUrl", category, active)
    VALUES (${slug}, ${name}, ${description ?? null}, ${price}, ${imageUrl}, ${category}, ${active})
  `

  revalidatePath('/productos')
  return { success: true }
}

export async function toggleProductActive(id: string, active: boolean) {
  await sql`UPDATE "Product" SET active = ${active} WHERE id = ${id}`
  revalidatePath('/productos')
}
