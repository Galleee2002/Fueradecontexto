import { sql } from '@/shared/infrastructure/db/client'
import type { AdminShippingProviderSettings } from '../types'

const CORREO_ARGENTINO_PROVIDER = 'correo_argentino'

export async function fetchCorreoArgentinoSettings(): Promise<AdminShippingProviderSettings | null> {
  const rows = await sql`
    SELECT id, provider, "customerId", "originPostalCode", "senderName", "senderEmail",
           "senderPhone", "senderStreet", "senderStreetNumber", "senderFloor",
           "senderApartment", "senderCity", "senderProvinceCode", "senderPostalCode",
           "createdAt", "updatedAt"
    FROM "ShippingProviderSettings"
    WHERE provider = ${CORREO_ARGENTINO_PROVIDER}
    LIMIT 1
  `

  return (rows[0] as AdminShippingProviderSettings | undefined) ?? null
}

export { CORREO_ARGENTINO_PROVIDER }
