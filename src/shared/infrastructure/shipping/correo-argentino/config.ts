import 'server-only'

import { getCorreoArgentinoSettingsFromDb } from './settings-store'
import { normalizeCorreoArgentinoCustomerId } from './utils'

function requireEnv(name: string) {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`${name} is not configured`)
  }

  return value
}

export async function getCorreoArgentinoConfig() {
  const settings = await getCorreoArgentinoSettingsFromDb()

  if (!settings) {
    throw new Error('Correo Argentino settings are not configured in admin')
  }

  const customerId = normalizeCorreoArgentinoCustomerId(settings.customerId)

  if (customerId !== settings.customerId) {
    console.warn('[correo-argentino] customerId normalized from admin settings', {
      storedCustomerId: settings.customerId,
      normalizedCustomerId: customerId,
    })
  }

  return {
    baseUrl: requireEnv('CORREO_ARGENTINO_BASE_URL').replace(/\/$/, ''),
    username: requireEnv('CORREO_ARGENTINO_USERNAME'),
    password: requireEnv('CORREO_ARGENTINO_PASSWORD'),
    customerId,
    originPostalCode: settings.originPostalCode,
    sender: {
      name: settings.senderName,
      email: settings.senderEmail,
      phone: settings.senderPhone,
      street: settings.senderStreet,
      streetNumber: settings.senderStreetNumber,
      floor: settings.senderFloor,
      apartment: settings.senderApartment,
      city: settings.senderCity,
      provinceCode: settings.senderProvinceCode,
      postalCode: settings.senderPostalCode,
    },
  }
}
