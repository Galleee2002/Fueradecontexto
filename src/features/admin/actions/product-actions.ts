'use server'

import { revalidatePath } from 'next/cache'
import { sql } from '@/lib/db/client'
import { productSchema } from '@/features/products/schemas/product-schema'
import type { ProductInput } from '@/features/products/schemas/product-schema'

export async function createAdminProduct(input: ProductInput) {
  const parsed = productSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  const { slug, name, description, price, imageUrl, category, active } = parsed.data

  await sql`
    INSERT INTO "Product" (slug, name, description, price, "imageUrl", category, active)
    VALUES (${slug}, ${name}, ${description ?? null}, ${price}, ${imageUrl}, ${category}, ${active})
  `

  revalidatePath('/admin/productos')
  revalidatePath('/productos')
  return { success: true }
}

export async function updateAdminProduct(id: string, input: ProductInput) {
  const parsed = productSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  const { slug, name, description, price, imageUrl, category, active } = parsed.data

  await sql`
    UPDATE "Product"
    SET
      slug = ${slug},
      name = ${name},
      description = ${description ?? null},
      price = ${price},
      "imageUrl" = ${imageUrl},
      category = ${category},
      active = ${active},
      "updatedAt" = NOW()
    WHERE id = ${id}
  `

  revalidatePath('/admin/productos')
  revalidatePath('/productos')
  revalidatePath(`/productos/${slug}`)
  return { success: true }
}

export async function deleteAdminProduct(id: string) {
  await sql`DELETE FROM "CartItem" WHERE "productId" = ${id}`
  await sql`DELETE FROM "Product" WHERE id = ${id}`

  revalidatePath('/admin/productos')
  revalidatePath('/productos')
  return { success: true }
}

export async function toggleAdminProductActive(id: string, active: boolean) {
  await sql`
    UPDATE "Product"
    SET active = ${active}, "updatedAt" = NOW()
    WHERE id = ${id}
  `

  revalidatePath('/admin/productos')
  revalidatePath('/productos')
}
