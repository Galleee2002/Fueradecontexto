import { SITE_WHATSAPP_E164 } from '@/shared/config/site'

function whatsappDigitsFromEnv(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim()
  if (!raw) return ''
  return raw.replace(/\D/g, '')
}

/** Valor para `wa.me`; prioriza env y cae al número oficial del sitio. */
export const WHATSAPP_NUMBER = whatsappDigitsFromEnv() || SITE_WHATSAPP_E164

export const WHATSAPP_DISPLAY = '(+54) 011 6196 - 5319'

export const WHATSAPP_URL = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : ''

export const INSTAGRAM_HANDLE = 'fueradecontextooo'
export const INSTAGRAM_DISPLAY = 'Fueradecontextooo'

export const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() ||
  `https://www.instagram.com/${INSTAGRAM_HANDLE}`

export const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: INSTAGRAM_URL,
    shortLabel: 'IG',
  },
  {
    label: 'Facebook',
    href: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? '',
    shortLabel: 'FB',
  },
  {
    label: 'TikTok',
    href: process.env.NEXT_PUBLIC_TIKTOK_URL ?? '',
    shortLabel: 'TT',
  },
].filter((link) => link.href)