import { prisma } from '@/shared/infrastructure/db/prisma'
import { importCorreoArgentinoShipment, getCorreoArgentinoTracking } from '@/shared/infrastructure/shipping/correo-argentino/client'
import { getCorreoArgentinoConfig } from '@/shared/infrastructure/shipping/correo-argentino/config'
import { CorreoArgentinoError } from '@/shared/infrastructure/shipping/correo-argentino/errors'
import {
  buildPostalCodeForProvinceCode,
  getProvinceCodeForShipping,
  normalizePostalCode,
  sanitizeFloorOrApartment,
} from '@/shared/infrastructure/shipping/correo-argentino/utils'
import {
  SHIPPING_CARRIER_CORREO_ARGENTINO,
  SHIPPING_METHOD_CORREO_ARGENTINO_BRANCH,
  SHIPPING_METHOD_CORREO_ARGENTINO_HOME,
} from '@/shared/config/shipping'
import { updateOrderShippingState } from '../infrastructure/order-repository'

type JsonRecord = Record<string, unknown>

function isRecord(value: unknown): value is JsonRecord {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function asNumber(value: unknown) {
  return typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
}

function getShippingDimensions(value: unknown) {
  if (!isRecord(value)) return null

  const weightGrams = asNumber(value.weightGrams)
  const heightCm = asNumber(value.heightCm)
  const widthCm = asNumber(value.widthCm)
  const lengthCm = asNumber(value.lengthCm)

  if ([weightGrams, heightCm, widthCm, lengthCm].some((item) => !Number.isFinite(item))) {
    return null
  }

  return { weightGrams, heightCm, widthCm, lengthCm }
}

function getQuotePayload(value: unknown) {
  if (!isRecord(value)) return null

  const productType = typeof value.productType === 'string' ? value.productType : null
  const deliveryType: 'D' | 'S' | null =
    value.deliveryType === 'S' ? 'S' : value.deliveryType === 'D' ? 'D' : null
  const agencyCode = typeof value.agencyCode === 'string' ? value.agencyCode : null
  if (!productType || !deliveryType) return null
  if (deliveryType === 'S' && !agencyCode) return null

  return { productType, deliveryType, agencyCode }
}

function getShippingAddress(value: unknown) {
  if (!isRecord(value)) return null

  const calle = typeof value.calle === 'string' ? value.calle : null
  const numero = typeof value.numero === 'string' ? value.numero : null
  const pisoDpto = typeof value.pisoDpto === 'string' ? value.pisoDpto : ''
  const ciudad = typeof value.ciudad === 'string' ? value.ciudad : null
  const provincia = typeof value.provincia === 'string' ? value.provincia : null
  const codigoPostal = typeof value.codigoPostal === 'string' ? value.codigoPostal : null
  const deliveryType = value.deliveryType === 'S' ? 'S' : value.deliveryType === 'D' ? 'D' : 'D'
  const agencyCode = typeof value.agencyCode === 'string' ? value.agencyCode : ''

  if (!calle || !numero || !ciudad || !provincia || !codigoPostal) {
    return null
  }

  return { calle, numero, pisoDpto, ciudad, provincia, codigoPostal, deliveryType, agencyCode }
}

function extractLastTrackingPayload(
  payload: Awaited<ReturnType<typeof getCorreoArgentinoTracking>>,
) {
  if (Array.isArray(payload)) {
    return payload[0] ?? null
  }

  return payload
}

function mapTrackingEventToStatuses(eventName: string | null) {
  const normalized = eventName?.toUpperCase() ?? ''

  if (normalized.includes('ENTREG')) {
    return { shippingStatus: 'delivered', orderStatus: 'delivered' } as const
  }

  if (normalized) {
    return { shippingStatus: 'in_transit', orderStatus: 'shipped' } as const
  }

  return { shippingStatus: 'imported', orderStatus: 'paid' } as const
}

function isAlreadyImportedMessage(message: string) {
  return message.toLowerCase().includes('importada con anterioridad')
}

export async function importOrderShipment(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  })

  if (!order || order.deletedAt) return
  if (order.status !== 'paid') return
  if (order.shippingCarrier !== SHIPPING_CARRIER_CORREO_ARGENTINO) return
  if (
    order.shippingMethod !== SHIPPING_METHOD_CORREO_ARGENTINO_HOME &&
    order.shippingMethod !== SHIPPING_METHOD_CORREO_ARGENTINO_BRANCH
  ) {
    return
  }
  if (order.shippingStatus === 'imported' || order.shippingStatus === 'in_transit' || order.shippingStatus === 'delivered') {
    return
  }

  const dimensions = getShippingDimensions(order.shippingDimensions)
  const quotePayload = getQuotePayload(order.shippingQuotePayload)
  const shippingAddress = getShippingAddress(order.shippingAddress)

  if (!dimensions || !quotePayload || !shippingAddress) {
    await updateOrderShippingState(orderId, {
      shippingStatus: 'import_failed',
      shippingError: 'Faltan datos logísticos persistidos para importar el envío.',
    })
    return
  }

  const config = await getCorreoArgentinoConfig()
  const provinceCode = getProvinceCodeForShipping(shippingAddress.provincia)
  const senderProvinceCode = normalizePostalCode(config.sender.provinceCode ?? '')
  const shippingCost = Number(order.shippingCost ?? 0)
  const declaredValue = Math.max(0, Number(order.total) - shippingCost)

  try {
    const response = await importCorreoArgentinoShipment({
      customerId: config.customerId,
      extOrderId: order.id,
      orderNumber: order.id,
      sender: {
        name: config.sender.name,
        phone: config.sender.phone,
        cellPhone: config.sender.phone,
        email: config.sender.email,
        originAddress: {
          streetName: config.sender.street,
          streetNumber: config.sender.streetNumber,
          floor: sanitizeFloorOrApartment(config.sender.floor),
          apartment: sanitizeFloorOrApartment(config.sender.apartment),
          city: config.sender.city,
          provinceCode: config.sender.provinceCode,
          postalCode: buildPostalCodeForProvinceCode(config.sender.postalCode, senderProvinceCode),
        },
      },
      recipient: {
        name: order.customerName,
        phone: order.customerPhone,
        cellPhone: order.customerPhone,
        email: order.customerEmail,
      },
      shipping: {
        deliveryType: quotePayload.deliveryType,
        agency: quotePayload.deliveryType === 'S' ? quotePayload.agencyCode : null,
        address: {
          streetName: shippingAddress.calle,
          streetNumber: shippingAddress.numero,
          floor: sanitizeFloorOrApartment(shippingAddress.pisoDpto),
          apartment: sanitizeFloorOrApartment(shippingAddress.pisoDpto),
          city: shippingAddress.ciudad,
          provinceCode,
          postalCode: buildPostalCodeForProvinceCode(shippingAddress.codigoPostal, provinceCode),
        },
        productType: quotePayload.productType,
        weight: dimensions.weightGrams,
        declaredValue,
        height: dimensions.heightCm,
        length: dimensions.lengthCm,
        width: dimensions.widthCm,
      },
    })

    await updateOrderShippingState(orderId, {
      shippingStatus: 'imported',
      shippingImportedAt: response.createdAt ? new Date(response.createdAt) : new Date(),
      shippingLastSyncAt: new Date(),
      shippingExternalId: order.shippingExternalId ?? order.id,
      shippingError: null,
    })
  } catch (error) {
    if (error instanceof CorreoArgentinoError && isAlreadyImportedMessage(error.message)) {
      await updateOrderShippingState(orderId, {
        shippingStatus: 'imported',
        shippingImportedAt: new Date(),
        shippingLastSyncAt: new Date(),
        shippingExternalId: order.shippingExternalId ?? order.id,
        shippingError: null,
      })
      return
    }

    console.error('[correo-argentino] shipment import failed', {
      orderId,
      error: error instanceof Error ? error.message : error,
    })

    await updateOrderShippingState(orderId, {
      shippingStatus: 'import_failed',
      shippingError: error instanceof Error ? error.message : 'No se pudo importar el envío.',
      shippingLastSyncAt: new Date(),
    })
  }
}

export async function syncOrderTracking(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  })

  if (!order || order.deletedAt) {
    return { ok: false, error: 'Orden no encontrada.' }
  }

  const shippingCandidates = [order.trackingNumber, order.shippingExternalId, order.id].filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0,
  )

  if (shippingCandidates.length === 0) {
    return { ok: false, error: 'La orden todavía no tiene tracking para consultar.' }
  }

  try {
    let normalized: ReturnType<typeof extractLastTrackingPayload> = null

    for (const shippingId of shippingCandidates) {
      const payload = await getCorreoArgentinoTracking(shippingId)
      normalized = extractLastTrackingPayload(payload)
      if (normalized?.events?.length || normalized?.trackingNumber || normalized?.id) {
        break
      }
    }

    const lastEvent = normalized?.events?.[0]?.event ?? null
    const mapped = mapTrackingEventToStatuses(lastEvent)

    await updateOrderShippingState(orderId, {
      shippingStatus: mapped.shippingStatus,
      status: mapped.orderStatus,
      trackingNumber: normalized?.trackingNumber ?? order.trackingNumber,
      shippingExternalId: normalized?.id ?? order.shippingExternalId,
      shippingTrackingPayload: normalized,
      shippingLastSyncAt: new Date(),
      shippingError: null,
    })

    return { ok: true, trackingNumber: normalized?.trackingNumber ?? null }
  } catch (error) {
    console.error('[correo-argentino] tracking sync failed', {
      orderId,
      error: error instanceof Error ? error.message : error,
    })

    await updateOrderShippingState(orderId, {
      shippingError: error instanceof Error ? error.message : 'No se pudo sincronizar el tracking.',
      shippingLastSyncAt: new Date(),
    })

    return {
      ok: false,
      error: error instanceof Error ? error.message : 'No se pudo sincronizar el tracking.',
    }
  }
}
