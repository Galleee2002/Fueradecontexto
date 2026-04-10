export const SITE_NAME = 'Fueradecontexto'
export const SITE_DESCRIPTION = 'Indumentaria & Accesorios — Minimalismo elevado'
export const MAX_CART_ITEMS = 10
export const MAX_PRODUCTS_PER_PAGE = 12

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const SITE_URL = rawSiteUrl.replace(/\/$/, '')
