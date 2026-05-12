import { SITE_WHATSAPP_E164 } from '@/shared/config/site'

function whatsappDigitsFromEnv(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim()
  if (!raw) return ''
  return raw.replace(/\D/g, '')
}

/** Valor para `wa.me`; prioriza env y cae al número oficial del sitio. */
export const WHATSAPP_NUMBER = whatsappDigitsFromEnv() || SITE_WHATSAPP_E164

export const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '',
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