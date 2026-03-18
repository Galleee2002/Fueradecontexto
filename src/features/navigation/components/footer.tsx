import Link from 'next/link'
import { Container } from '@/components/shared/layout/container'
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants/site'

const NAV_LINKS = [
  { label: 'Colección', href: '/productos' },
  { label: 'Novedades', href: '/productos?sort=newest' },
  { label: 'Accesorios', href: '/productos?category=accesorios' },
  { label: 'Quiénes somos', href: '/quienes-somos' },
]

const LEGAL_LINKS = [
  { label: 'Términos y condiciones', href: '/legal/terminos' },
  { label: 'Política de privacidad', href: '/legal/privacidad' },
  { label: 'Cambios y devoluciones', href: '/legal/cambios' },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background border-t border-border">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16">
          {/* Columna 1 — Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-xl font-medium tracking-widest uppercase font-sans block hover:opacity-70 transition-opacity"
            >
              {SITE_NAME}
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {SITE_DESCRIPTION}
            </p>
          </div>

          {/* Columna 2 — Navegación */}
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans">
              Navegación
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 — Legal */}
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans">
              Legal
            </p>
            <ul className="space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {/* Strip de copyright */}
      <div className="border-t border-border/20">
        <Container>
          <p className="text-xs text-muted-foreground py-6">
            © {new Date().getFullYear()} {SITE_NAME} · Todos los derechos reservados
          </p>
        </Container>
      </div>
    </footer>
  )
}
