import Link from 'next/link'
import { Instagram } from 'lucide-react'
import {
  INSTAGRAM_DISPLAY,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
} from '@/features/navigation/constants/external-links'
import { WhatsAppIcon } from '@/features/navigation/components/whatsapp-icon'
import { SITE_NAME, SITE_DESCRIPTION } from '@/shared/config/site'

const socialLinkClass =
  'inline-flex items-center gap-2 text-xs leading-[2.41] text-footer-muted underline-offset-4 transition-colors hover:text-footer-foreground'

const NAV_LINKS = [
  { label: 'Explorar', href: '/productos' },
  { label: 'Talles', href: '/talles' },
  { label: 'Ayuda', href: '/ayuda' },
]

const LEGAL_LINKS = [
  { label: 'Términos y condiciones', href: '/legal/terminos' },
  { label: 'Política de privacidad', href: '/legal/privacidad' },
  { label: 'Cambios y devoluciones', href: '/legal/cambios' },
]

const linkClass =
  'text-xs leading-[2.41] text-footer-foreground underline-offset-4 decoration-white/35 underline transition-colors hover:text-white hover:decoration-white'

export function Footer() {
  return (
    <footer className="border-t border-footer-border bg-footer-bg text-footer-foreground">
      <div className="mx-auto w-full max-w-[1380px] px-5 sm:px-7 lg:px-10">
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:py-20">
          <div className="space-y-4">
            <Link
              href="/"
              className="block text-xs font-semibold uppercase tracking-[0.12em] text-footer-foreground transition-opacity hover:opacity-80"
            >
              {SITE_NAME}
            </Link>
            <p className="max-w-sm text-xs leading-[2.41] text-footer-muted">
              {SITE_DESCRIPTION}
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram @${INSTAGRAM_HANDLE}`}
                className={socialLinkClass}
              >
                <Instagram className="size-4 shrink-0" aria-hidden />
                {INSTAGRAM_DISPLAY}
              </a>
              {WHATSAPP_URL ? (
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`WhatsApp ${WHATSAPP_DISPLAY}`}
                  className={socialLinkClass}
                >
                  <WhatsAppIcon className="size-4 shrink-0" />
                  {WHATSAPP_DISPLAY}
                </a>
              ) : null}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold text-footer-foreground">Navegación</p>
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold text-footer-foreground">Legal</p>
            <ul>
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-footer-border">
        <div className="mx-auto w-full max-w-[1380px] px-5 sm:px-7 lg:px-10">
          <p className="py-6 text-xs leading-normal text-footer-muted">
            © {new Date().getFullYear()} {SITE_NAME} · Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  )
}
