'use client'

import { WHATSAPP_URL } from '@/features/navigation/constants/external-links'
import { WhatsAppIcon } from '@/features/navigation/components/whatsapp-icon'

export function WhatsAppButton() {
  if (!WHATSAPP_URL) return null

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1ebe57] transition-colors"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  )
}
