import Link from 'next/link'
import { SITE_NAME, SITE_DESCRIPTION } from '@/shared/config/site'

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

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#121820] text-background">
      <div className="mx-auto w-full max-w-[1380px] px-5 sm:px-7 lg:px-10">
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:py-20">
          {/* Columna 1 — Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="block text-sm font-medium uppercase tracking-[0.34em] text-white transition-opacity hover:opacity-75"
            >
              {SITE_NAME}
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/62">
              {SITE_DESCRIPTION}
            </p>
          </div>

          {/* Columna 2 — Navegación */}
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">
              Navegación
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/72 transition-colors hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 — Legal */}
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">
              Legal
            </p>
            <ul className="space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/72 transition-colors hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Strip de copyright */}
      <div className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1380px] px-5 sm:px-7 lg:px-10">
          <p className="py-6 text-xs text-white/42">
            © {new Date().getFullYear()} {SITE_NAME} · Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  )
}
