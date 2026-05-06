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

const linkClass =
  'text-xs leading-[2.41] text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1380px] px-5 sm:px-7 lg:px-10">
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:py-20">
          <div className="space-y-4">
            <Link
              href="/"
              className="block text-xs font-semibold uppercase tracking-[0.12em] text-foreground transition-opacity hover:opacity-70"
            >
              {SITE_NAME}
            </Link>
            <p className="max-w-sm text-xs leading-[2.41] text-muted-foreground">
              {SITE_DESCRIPTION}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold text-foreground">Navegación</p>
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
            <p className="text-xs font-semibold text-foreground">Legal</p>
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

      <div className="border-t border-border">
        <div className="mx-auto w-full max-w-[1380px] px-5 sm:px-7 lg:px-10">
          <p className="py-6 text-xs leading-normal text-muted-foreground">
            © {new Date().getFullYear()} {SITE_NAME} · Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  )
}
