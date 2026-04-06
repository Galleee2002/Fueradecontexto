'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { sql } from '@/lib/db/client'
import { productSchema } from '@/features/products/schemas/product-schema'
import type { ProductInput } from '@/features/products/schemas/product-schema'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
}

export async function createAdminProduct(input: ProductInput) {
  await requireAdmin()
  const parsed = productSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  const { slug, name, description, price, imageUrl, previewImages, category, subcategory, active,
          availableColors, availableSizes, stampSizes, stampLocations } = parsed.data

  const id = crypto.randomUUID()

  await sql`
    INSERT INTO "Product" (id, slug, name, description, price, "imageUrl", "previewImages", category, subcategory, active,
                           "availableColors", "availableSizes", "stampSizes", "stampLocations",
                           "createdAt", "updatedAt")
    VALUES (${id}, ${slug}, ${name}, ${description ?? null}, ${price}, ${imageUrl}, ${JSON.stringify(previewImages)}::jsonb, ${category}, ${subcategory}, ${active},
            ${JSON.stringify(availableColors)}::jsonb, ${JSON.stringify(availableSizes)}::jsonb,
            ${JSON.stringify(stampSizes)}::jsonb, ${JSON.stringify(stampLocations)}::jsonb,
            NOW(), NOW())
  `

  revalidatePath('/admin/productos')
  revalidatePath('/productos')
  return { success: true }
}

export async function updateAdminProduct(id: string, input: ProductInput) {
  await requireAdmin()
  const parsed = productSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  const { slug, name, description, price, imageUrl, previewImages, category, subcategory, active,
          availableColors, availableSizes, stampSizes, stampLocations } = parsed.data

  await sql`
    UPDATE "Product"
    SET
      slug = ${slug},
      name = ${name},
      description = ${description ?? null},
      price = ${price},
      "imageUrl" = ${imageUrl},
      "previewImages" = ${JSON.stringify(previewImages)}::jsonb,
      category = ${category},
      subcategory = ${subcategory},
      active = ${active},
      "availableColors" = ${JSON.stringify(availableColors)}::jsonb,
      "availableSizes" = ${JSON.stringify(availableSizes)}::jsonb,
      "stampSizes" = ${JSON.stringify(stampSizes)}::jsonb,
      "stampLocations" = ${JSON.stringify(stampLocations)}::jsonb,
      "updatedAt" = NOW()
    WHERE id = ${id}
  `

  revalidatePath('/admin/productos')
  revalidatePath('/productos')
  revalidatePath(`/productos/${slug}`)
  return { success: true }
}

export async function deleteAdminProduct(id: string) {
  await requireAdmin()
  await sql`DELETE FROM "CartItem" WHERE "productId" = ${id}`
  await sql`
    UPDATE "Product"
    SET "deletedAt" = NOW(), "updatedAt" = NOW()
    WHERE id = ${id}
  `

  revalidatePath('/admin/productos')
  revalidatePath('/productos')
  revalidatePath('/')
  return { success: true }
}

export async function toggleAdminProductActive(id: string, active: boolean) {
  await requireAdmin()
  await sql`
    UPDATE "Product"
    SET active = ${active}, "updatedAt" = NOW()
    WHERE id = ${id}
  `

  revalidatePath('/admin/productos')
  revalidatePath('/productos')
  revalidatePath('/')
}
