'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { sql } from '@/lib/db/client'
import { sizeGuideSchema } from '@/features/products/schemas/product-schema'
import type { SizeGuideInput } from '@/features/products/schemas/product-schema'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
}

export async function upsertSizeGuide(input: SizeGuideInput) {
  await requireAdmin()
  const parsed = sizeGuideSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  const { category, rows } = parsed.data

  await sql`
    INSERT INTO "SizeGuide" (id, category, rows, "createdAt", "updatedAt")
    VALUES (gen_random_uuid()::text, ${category}, ${JSON.stringify(rows)}::jsonb, NOW(), NOW())
    ON CONFLICT (category) DO UPDATE SET rows = ${JSON.stringify(rows)}::jsonb, "updatedAt" = NOW()
  `

  revalidatePath('/admin/guia-talles')
  revalidatePath('/productos')
  return { success: true }
}

export async function deleteSizeGuide(category: string) {
  await requireAdmin()
  await sql`DELETE FROM "SizeGuide" WHERE category = ${category}`
  revalidatePath('/admin/guia-talles')
  return { success: true }
}
