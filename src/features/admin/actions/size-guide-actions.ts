'use server'

import { revalidatePath } from 'next/cache'
import { sql } from '@/shared/infrastructure/db/client'
import { assertAdminSession } from '@/shared/infrastructure/auth/require-admin'
import { sizeGuideSchema } from '@/features/products/schemas/product-schema'
import type { SizeGuideInput } from '@/features/products/schemas/product-schema'

export async function upsertSizeGuide(input: SizeGuideInput) {
  await assertAdminSession()
  const parsed = sizeGuideSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  const categoryNorm = parsed.data.category.trim()
  const { rows } = parsed.data

  await sql`
    INSERT INTO "SizeGuide" (id, category, rows, "createdAt", "updatedAt")
    VALUES (gen_random_uuid()::text, ${categoryNorm}, ${JSON.stringify(rows)}::jsonb, NOW(), NOW())
    ON CONFLICT (category) DO UPDATE SET rows = ${JSON.stringify(rows)}::jsonb, "updatedAt" = NOW()
  `

  revalidatePath('/admin/guia-talles')
  revalidatePath('/talles')
  revalidatePath('/productos', 'layout')
  return { success: true }
}

export async function deleteSizeGuide(category: string) {
  await assertAdminSession()
  const trimmed = category.trim()
  await sql`
    DELETE FROM "SizeGuide"
    WHERE LOWER(TRIM(category)) = LOWER(${trimmed})
  `
  revalidatePath('/admin/guia-talles')
  revalidatePath('/talles')
  revalidatePath('/productos', 'layout')
  return { success: true }
}
