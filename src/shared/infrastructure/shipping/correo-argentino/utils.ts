const PROVINCE_CODE_BY_NORMALIZED_NAME: Record<string, string> = {
  salta: 'A',
  'buenos aires': 'B',
  'provincia de buenos aires': 'B',
  'ciudad autonoma de buenos aires': 'C',
  'ciudad autónoma de buenos aires': 'C',
  caba: 'C',
  'capital federal': 'C',
  'san luis': 'D',
  'entre rios': 'E',
  'entre ríos': 'E',
  'la rioja': 'F',
  'santiago del estero': 'G',
  chaco: 'H',
  'san juan': 'J',
  catamarca: 'K',
  'la pampa': 'L',
  mendoza: 'M',
  misiones: 'N',
  formosa: 'P',
  neuquen: 'Q',
  'neuquén': 'Q',
  'rio negro': 'R',
  'río negro': 'R',
  'santa fe': 'S',
  tucuman: 'T',
  'tucumán': 'T',
  chubut: 'U',
  'tierra del fuego': 'V',
  corrientes: 'W',
  cordoba: 'X',
  'córdoba': 'X',
  jujuy: 'Y',
  'santa cruz': 'Z',
}

const CORREO_ARGENTINO_CUSTOMER_ID_MAX_LENGTH = 10

export function normalizeCorreoArgentinoCustomerId(value: string) {
  const normalized = value.trim()

  if (!/^\d+$/.test(normalized)) {
    throw new Error('El customerId de Correo Argentino debe contener solo dígitos.')
  }

  if (normalized.length > CORREO_ARGENTINO_CUSTOMER_ID_MAX_LENGTH) {
    throw new Error('El customerId de Correo Argentino no puede superar los 10 dígitos.')
  }

  return normalized.padStart(CORREO_ARGENTINO_CUSTOMER_ID_MAX_LENGTH, '0')
}

export function normalizeProvincia(value: string) {
  return value.trim().toLowerCase()
}

export function getProvinceCodeForShipping(provincia: string) {
  const code = PROVINCE_CODE_BY_NORMALIZED_NAME[normalizeProvincia(provincia)]

  if (!code) {
    throw new Error(`Provincia no mapeable para Correo Argentino: ${provincia}`)
  }

  return code
}

export function normalizePostalCode(value: string) {
  return value.replace(/\s+/g, '').trim().toUpperCase()
}

export function extractPostalCodeBase(value: string) {
  const normalized = normalizePostalCode(value)
  const numericBaseMatch = normalized.match(/\d{4}/)

  return numericBaseMatch?.[0] ?? normalized
}

export function postalCodeMatchesProvinceCode(value: string, provinceCode: string) {
  const normalized = normalizePostalCode(value)

  if (!/^[A-Z]\d{4}[A-Z]{0,3}$/.test(normalized)) {
    return true
  }

  return normalized.startsWith(provinceCode)
}

export function buildPostalCodeForProvinceCode(value: string, provinceCode: string) {
  const normalized = normalizePostalCode(value)

  if (/^\d{4}$/.test(normalized)) {
    return `${provinceCode}${normalized}`
  }

  return normalized
}

export function sanitizeFloorOrApartment(value: string) {
  return value.trim().slice(0, 3)
}

export function buildAddressFingerprint(input: {
  deliveryType?: 'D' | 'S'
  calle: string
  numero: string
  pisoDpto: string
  ciudad: string
  provincia: string
  codigoPostal: string
  agencyCode?: string
}) {
  const provinceCode = PROVINCE_CODE_BY_NORMALIZED_NAME[normalizeProvincia(input.provincia)]
  const normalizedPostalCode = provinceCode
    ? buildPostalCodeForProvinceCode(input.codigoPostal, provinceCode)
    : normalizePostalCode(input.codigoPostal)

  return [
    input.deliveryType ?? 'D',
    input.calle.trim().toLowerCase(),
    input.numero.trim().toLowerCase(),
    input.pisoDpto.trim().toLowerCase(),
    input.ciudad.trim().toLowerCase(),
    normalizeProvincia(input.provincia),
    normalizedPostalCode,
    (input.agencyCode ?? '').trim().toLowerCase(),
  ].join('|')
}
