import 'server-only'

import { prisma } from '@/shared/infrastructure/db/prisma'

export const CORREO_ARGENTINO_PROVIDER = 'correo_argentino'

export async function getCorreoArgentinoSettingsFromDb() {
  return prisma.shippingProviderSettings.findUnique({
    where: {
      provider: CORREO_ARGENTINO_PROVIDER,
    },
  })
}
