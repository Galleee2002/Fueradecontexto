import { extractPostalCodeBase, normalizePostalCode } from '@/shared/infrastructure/shipping/correo-argentino/utils'
import type { CorreoArgentinoAgency } from '@/shared/infrastructure/shipping/correo-argentino/types'

export interface RankedAgency extends CorreoArgentinoAgency {
  score: number
}

function normalizeText(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

function getAgencyPostalCode(agency: CorreoArgentinoAgency) {
  return normalizePostalCode(agency.location?.address?.postalCode ?? '')
}

function getAgencyCity(agency: CorreoArgentinoAgency) {
  const city = agency.location?.address?.city ?? agency.location?.address?.locality ?? agency.name
  return normalizeText(city)
}

export function rankAgenciesByNearbyInput(
  agencies: CorreoArgentinoAgency[],
  input: { codigoPostal: string; ciudad: string },
): RankedAgency[] {
  const postalCodeNormalized = normalizePostalCode(input.codigoPostal)
  const postalCodeBase = extractPostalCodeBase(postalCodeNormalized)
  const cityNormalized = normalizeText(input.ciudad)

  return [...agencies]
    .map((agency) => {
      let score = 0
      const agencyPostalCode = getAgencyPostalCode(agency)
      const agencyCity = getAgencyCity(agency)
      const agencyName = normalizeText(agency.name)

      if (postalCodeNormalized && agencyPostalCode && agencyPostalCode === postalCodeNormalized) {
        score += 3
      } else if (
        postalCodeBase &&
        agencyPostalCode &&
        extractPostalCodeBase(agencyPostalCode) === postalCodeBase
      ) {
        score += 3
      }

      if (cityNormalized && agencyCity && agencyCity === cityNormalized) {
        score += 2
      }

      if (cityNormalized && agencyName.includes(cityNormalized)) {
        score += 1
      }

      return { ...agency, score }
    })
    .sort((a, b) => b.score - a.score || a.code.localeCompare(b.code))
}
