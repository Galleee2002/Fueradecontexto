import 'server-only'

import { CorreoArgentinoError } from './errors'
import { getCorreoArgentinoConfig } from './config'
import type {
  CorreoArgentinoApiError,
  CorreoArgentinoRatesRequest,
  CorreoArgentinoRatesResponse,
  CorreoArgentinoShippingImportRequest,
  CorreoArgentinoShippingImportResponse,
  CorreoArgentinoTokenResponse,
  CorreoArgentinoTrackingResponse,
} from './types'

type CachedToken = {
  token: string
  expiresAtMs: number
}

let cachedToken: CachedToken | null = null

function parseJwtExpiry(token: string) {
  try {
    const [, payloadSegment] = token.split('.')
    if (!payloadSegment) return null

    const normalized = payloadSegment.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    const payload = JSON.parse(Buffer.from(padded, 'base64').toString('utf8')) as { exp?: number }

    return typeof payload.exp === 'number' ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

function parseExpiresAt(value?: string | null, token?: string) {
  if (!value) {
    return parseJwtExpiry(token ?? '') ?? Date.now() + 5 * 60 * 1000
  }

  const normalized = value.includes('T') ? value : value.replace(' ', 'T')
  const timestamp = Date.parse(normalized)
  return Number.isNaN(timestamp) ? parseJwtExpiry(token ?? '') ?? Date.now() + 5 * 60 * 1000 : timestamp
}

function buildBasicAuth(username: string, password: string) {
  return Buffer.from(`${username}:${password}`).toString('base64')
}

function toErrorMessage(payload: CorreoArgentinoApiError | null, fallback: string) {
  return payload?.message || payload?.error || fallback
}

async function parseJsonResponse<T>(response: Response): Promise<T | null> {
  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

async function requestToken(forceRefresh = false) {
  if (!forceRefresh && cachedToken && cachedToken.expiresAtMs - Date.now() > 30_000) {
    return cachedToken.token
  }

  const config = await getCorreoArgentinoConfig()
  const response = await fetch(`${config.baseUrl}/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${buildBasicAuth(config.username, config.password)}`,
    },
    cache: 'no-store',
  })

  const payload = await parseJsonResponse<CorreoArgentinoTokenResponse & CorreoArgentinoApiError>(response)

  if (!response.ok || !payload?.token) {
    console.error('[correo-argentino] token request failed', {
      status: response.status,
      baseUrl: config.baseUrl,
      message: toErrorMessage(payload, 'No se pudo autenticar con Correo Argentino.'),
    })

    throw new CorreoArgentinoError(
      toErrorMessage(payload, 'No se pudo autenticar con Correo Argentino.'),
      {
        status: response.status,
        code: payload?.code ?? null,
        retriable: response.status >= 500 || response.status === 429,
      },
    )
  }

  if (!payload.expires && !payload.expire) {
    console.warn('[correo-argentino] token response missing expires', {
      status: response.status,
      baseUrl: config.baseUrl,
      payloadKeys: payload ? Object.keys(payload) : [],
    })
  }

  cachedToken = {
    token: payload.token,
    expiresAtMs: parseExpiresAt(payload.expires ?? payload.expire, payload.token),
  }

  return payload.token
}

async function authorizedJsonRequest<TResponse>(path: string, init: RequestInit, retry = true) {
  const token = await requestToken(false)
  const config = await getCorreoArgentinoConfig()

  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  })

  if (response.status === 401 && retry) {
    cachedToken = null
    await requestToken(true)
    return authorizedJsonRequest<TResponse>(path, init, false)
  }

  const payload = await parseJsonResponse<TResponse & CorreoArgentinoApiError>(response)

  if (!response.ok) {
    console.error('[correo-argentino] api request failed', {
      path,
      status: response.status,
      baseUrl: config.baseUrl,
      customerId: config.customerId,
      message: toErrorMessage(payload, 'La API de Correo Argentino devolvió un error.'),
    })

    throw new CorreoArgentinoError(
      toErrorMessage(payload, 'La API de Correo Argentino devolvió un error.'),
      {
        status: response.status,
        code: payload?.code ?? null,
        retriable: response.status >= 500 || response.status === 429,
      },
    )
  }

  return payload as TResponse
}

export async function quoteCorreoArgentinoRates(body: CorreoArgentinoRatesRequest) {
  return authorizedJsonRequest<CorreoArgentinoRatesResponse>('/rates', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function importCorreoArgentinoShipment(body: CorreoArgentinoShippingImportRequest) {
  return authorizedJsonRequest<CorreoArgentinoShippingImportResponse>('/shipping/import', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function getCorreoArgentinoTracking(shippingId: string) {
  return authorizedJsonRequest<CorreoArgentinoTrackingResponse | CorreoArgentinoTrackingResponse[]>(
    `/shipping/tracking?shippingId=${encodeURIComponent(shippingId)}`,
    {
      method: 'GET',
    },
  )
}
