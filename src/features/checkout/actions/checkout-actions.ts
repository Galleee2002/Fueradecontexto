'use server'

import { createOrderAndPreferenceUseCase } from '../application/create-order-and-preference'
import { buildShippingQuote } from '../application/build-shipping-quote'
import { ShippingQuoteError } from '../lib/shipping-quote-error'
import { rankAgenciesByNearbyInput } from '../lib/agency-ranking'
import type {
  ContactData,
  ShippingData,
  CartItemInput,
  ShippingSelection,
  ShippingQuote,
  QuoteShippingErrorCode,
  ShippingFormErrors,
} from '../types'
import { getProvinceCodeForShipping } from '@/shared/infrastructure/shipping/correo-argentino/utils'
import { getCorreoArgentinoAgencies } from '@/shared/infrastructure/shipping/correo-argentino/client'
import { getCorreoArgentinoConfig } from '@/shared/infrastructure/shipping/correo-argentino/config'
import type { CorreoArgentinoAgency } from '@/shared/infrastructure/shipping/correo-argentino/types'

export interface CreateOrderError {
  error: string
}

export interface QuoteShippingErrorResult {
  error: string
  code: QuoteShippingErrorCode
  fieldErrors?: ShippingFormErrors
}

export interface CreatePreferenceResult {
  initPoint: string
}

export interface QuoteShippingResult {
  quote: ShippingQuote
}

export interface NearbyAgencyOption {
  code: string
  name: string
  city: string
  province: string
  postalCode: string
}

export interface NearbyAgenciesResult {
  suggested: NearbyAgencyOption[]
  all: NearbyAgencyOption[]
}

function mapAgencyToOption(agency: CorreoArgentinoAgency): NearbyAgencyOption {
  return {
    code: agency.code,
    name: agency.name,
    city: agency.location?.address?.city ?? agency.location?.address?.locality ?? '',
    province: agency.location?.address?.province ?? '',
    postalCode: agency.location?.address?.postalCode ?? '',
  }
}

const PROVINCES_WITH_CORREO_AGENCIES = new Set([
  'Buenos Aires',
  'Ciudad Autónoma de Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
])

export async function createOrderAndPreference(
  contact: ContactData,
  shipping: ShippingData,
  cartItems: CartItemInput[],
  shippingSelection: ShippingSelection,
): Promise<CreatePreferenceResult | CreateOrderError> {
  return createOrderAndPreferenceUseCase(contact, shipping, cartItems, shippingSelection)
}

export async function quoteShipping(
  shipping: ShippingData,
  cartItems: CartItemInput[],
): Promise<QuoteShippingResult | QuoteShippingErrorResult> {
  try {
    const quote = await buildShippingQuote(shipping, cartItems)
    return { quote }
  } catch (error) {
    if (error instanceof ShippingQuoteError) {
      const response: QuoteShippingErrorResult = {
        error: error.message,
        code: error.code,
      }

      if (error.fieldErrors) {
        response.fieldErrors = error.fieldErrors
      }

      return response
    }

    return {
      error: error instanceof Error ? error.message : 'No se pudo cotizar el envío.',
      code: 'carrier_error',
    }
  }
}

export async function loadNearbyAgencies(
  input: Pick<ShippingData, 'provincia' | 'codigoPostal' | 'ciudad'>,
): Promise<NearbyAgenciesResult> {
  const normalizedProvince = input.provincia.trim()

  if (!normalizedProvince || !PROVINCES_WITH_CORREO_AGENCIES.has(normalizedProvince)) {
    return { suggested: [], all: [] }
  }

  const config = await getCorreoArgentinoConfig()
  const provinceCode = getProvinceCodeForShipping(input.provincia)
  const agencies = await getCorreoArgentinoAgencies({
    customerId: config.customerId,
    provinceCode,
  })
  const ranked = rankAgenciesByNearbyInput(agencies, input)
  const mapped = ranked.map(mapAgencyToOption)

  return {
    suggested: mapped.slice(0, 10),
    all: mapped,
  }
}
