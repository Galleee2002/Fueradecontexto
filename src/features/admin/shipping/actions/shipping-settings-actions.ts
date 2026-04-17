'use server'

import { revalidatePath } from 'next/cache'
import { sql } from '@/shared/infrastructure/db/client'
import { assertAdminSession } from '@/shared/infrastructure/auth/require-admin'
import {
  shippingProviderSettingsSchema,
  type ShippingProviderSettingsInput,
} from '../schemas/shipping-settings-schema'
import { CORREO_ARGENTINO_PROVIDER } from '../queries/shipping-settings-queries'

export async function saveCorreoArgentinoSettings(input: ShippingProviderSettingsInput) {
  await assertAdminSession()

  const parsed = shippingProviderSettingsSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  const data = parsed.data

  await sql`
    INSERT INTO "ShippingProviderSettings" (
      id, provider, "customerId", "originPostalCode", "senderName", "senderEmail",
      "senderPhone", "senderStreet", "senderStreetNumber", "senderFloor",
      "senderApartment", "senderCity", "senderProvinceCode", "senderPostalCode",
      "createdAt", "updatedAt"
    )
    VALUES (
      ${crypto.randomUUID()}, ${CORREO_ARGENTINO_PROVIDER}, ${data.customerId}, ${data.originPostalCode},
      ${data.senderName}, ${data.senderEmail}, ${data.senderPhone}, ${data.senderStreet},
      ${data.senderStreetNumber}, ${data.senderFloor}, ${data.senderApartment},
      ${data.senderCity}, ${data.senderProvinceCode}, ${data.senderPostalCode}, NOW(), NOW()
    )
    ON CONFLICT (provider)
    DO UPDATE SET
      "customerId" = EXCLUDED."customerId",
      "originPostalCode" = EXCLUDED."originPostalCode",
      "senderName" = EXCLUDED."senderName",
      "senderEmail" = EXCLUDED."senderEmail",
      "senderPhone" = EXCLUDED."senderPhone",
      "senderStreet" = EXCLUDED."senderStreet",
      "senderStreetNumber" = EXCLUDED."senderStreetNumber",
      "senderFloor" = EXCLUDED."senderFloor",
      "senderApartment" = EXCLUDED."senderApartment",
      "senderCity" = EXCLUDED."senderCity",
      "senderProvinceCode" = EXCLUDED."senderProvinceCode",
      "senderPostalCode" = EXCLUDED."senderPostalCode",
      "updatedAt" = NOW()
  `

  revalidatePath('/admin/envios')

  return { success: true }
}
