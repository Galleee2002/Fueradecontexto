'use server'

import { revalidatePath } from 'next/cache'
import { sql } from '@/shared/infrastructure/db/client'
import { assertAdminSession } from '@/shared/infrastructure/auth/require-admin'
import { productSchema } from '@/features/products/schemas/product-schema'
import type { ProductInput } from '@/features/products/schemas/product-schema'
import { getLegacyPreviewImages, getPrimaryProductImage } from '@/entities/product/images'
import { ensureProductColumnSupport } from '@/shared/infrastructure/db/product-column-support'

export async function createAdminProduct(input: ProductInput) {
  await assertAdminSession()
  const parsed = productSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  const {
    slug,
    name,
    description,
    price,
    stock,
    images,
    category,
    subcategory,
    active,
    availableColors,
    availableSizes,
    stampSizes,
    stampLocations,
  } = parsed.data

  const id = crypto.randomUUID()
  const imageUrl = getPrimaryProductImage(images)
  const previewImages = getLegacyPreviewImages(images)
  const { hasImages, hasPreviewImages } = await ensureProductColumnSupport()

  if (hasImages && hasPreviewImages) {
    await sql`
      INSERT INTO "Product" (id, slug, name, description, price, stock, "imageUrl", "previewImages", "images", category, subcategory, active,
                            "availableColors", "availableSizes", "stampSizes", "stampLocations",
                            "createdAt", "updatedAt")
      VALUES (${id}, ${slug}, ${name}, ${description ?? null}, ${price}, ${stock}, ${imageUrl}, ${JSON.stringify(previewImages)}::jsonb, ${JSON.stringify(images)}::jsonb, ${category}, ${subcategory}, ${active},
              ${JSON.stringify(availableColors)}::jsonb, ${JSON.stringify(availableSizes)}::jsonb,
              ${JSON.stringify(stampSizes)}::jsonb, ${JSON.stringify(stampLocations)}::jsonb,
              NOW(), NOW())
    `
  } else if (hasPreviewImages) {
    await sql`
      INSERT INTO "Product" (id, slug, name, description, price, stock, "imageUrl", "previewImages", category, subcategory, active,
                            "availableColors", "availableSizes", "stampSizes", "stampLocations",
                            "createdAt", "updatedAt")
      VALUES (${id}, ${slug}, ${name}, ${description ?? null}, ${price}, ${stock}, ${imageUrl}, ${JSON.stringify(previewImages)}::jsonb, ${category}, ${subcategory}, ${active},
              ${JSON.stringify(availableColors)}::jsonb, ${JSON.stringify(availableSizes)}::jsonb,
              ${JSON.stringify(stampSizes)}::jsonb, ${JSON.stringify(stampLocations)}::jsonb,
              NOW(), NOW())
    `
  } else {
    await sql`
      INSERT INTO "Product" (id, slug, name, description, price, stock, "imageUrl", category, subcategory, active,
                            "availableColors", "availableSizes", "stampSizes", "stampLocations",
                            "createdAt", "updatedAt")
      VALUES (${id}, ${slug}, ${name}, ${description ?? null}, ${price}, ${stock}, ${imageUrl}, ${category}, ${subcategory}, ${active},
              ${JSON.stringify(availableColors)}::jsonb, ${JSON.stringify(availableSizes)}::jsonb,
              ${JSON.stringify(stampSizes)}::jsonb, ${JSON.stringify(stampLocations)}::jsonb,
              NOW(), NOW())
    `
  }

  revalidatePath('/admin/productos')
  revalidatePath('/productos')
  return { success: true }
}

export async function updateAdminProduct(id: string, input: ProductInput) {
  await assertAdminSession()
  const parsed = productSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  const {
    slug,
    name,
    description,
    price,
    stock,
    images,
    category,
    subcategory,
    active,
    availableColors,
    availableSizes,
    stampSizes,
    stampLocations,
  } = parsed.data
  const imageUrl = getPrimaryProductImage(images)
  const previewImages = getLegacyPreviewImages(images)
  const { hasImages, hasPreviewImages } = await ensureProductColumnSupport()

  if (hasImages && hasPreviewImages) {
    await sql`
      UPDATE "Product"
      SET
        slug = ${slug},
        name = ${name},
        description = ${description ?? null},
        price = ${price},
        stock = ${stock},
        "imageUrl" = ${imageUrl},
        "previewImages" = ${JSON.stringify(previewImages)}::jsonb,
        "images" = ${JSON.stringify(images)}::jsonb,
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
  } else if (hasPreviewImages) {
    await sql`
      UPDATE "Product"
      SET
        slug = ${slug},
        name = ${name},
        description = ${description ?? null},
        price = ${price},
        stock = ${stock},
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
  } else {
    await sql`
      UPDATE "Product"
      SET
        slug = ${slug},
        name = ${name},
        description = ${description ?? null},
        price = ${price},
        stock = ${stock},
        "imageUrl" = ${imageUrl},
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
  }

  revalidatePath('/admin/productos')
  revalidatePath('/productos')
  revalidatePath(`/productos/${slug}`)
  return { success: true }
}

export async function deleteAdminProduct(id: string) {
  await assertAdminSession()
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
  await assertAdminSession()
  await sql`
    UPDATE "Product"
    SET active = ${active}, "updatedAt" = NOW()
    WHERE id = ${id}
  `

  revalidatePath('/admin/productos')
  revalidatePath('/productos')
  revalidatePath('/')
}
