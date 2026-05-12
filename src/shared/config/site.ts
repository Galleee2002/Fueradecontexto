export const SITE_NAME = 'Fueradecontexto'
export const SITE_CONTACT_EMAIL = 'fueradecontexto04@gmail.com'
/** Dígitos internacionales sin + ni espacios (wa.me / NEXT_PUBLIC_WHATSAPP_NUMBER). AR móvil CABA. */
export const SITE_WHATSAPP_E164 = '5491161965319'
/** Formato legible para la tienda (mismo número que SITE_WHATSAPP_E164). */
export const SITE_WHATSAPP_DISPLAY = '11 6196-5319'
export const SITE_DESCRIPTION = 'Indumentaria & Accesorios — Minimalismo elevado'
export const MAX_CART_ITEMS = 10
export const MAX_PRODUCTS_PER_PAGE = 12

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const SITE_URL = rawSiteUrl.replace(/\/$/, '')
