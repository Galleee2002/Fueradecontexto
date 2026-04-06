export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

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