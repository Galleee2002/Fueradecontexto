import Link from 'next/link'
import { Container } from '@/components/shared/layout/container'
import { UserMenu } from '@/features/auth/components/user-menu'
import { CartIcon } from './cart-icon'
import { SearchBar } from './search-bar'
import { MobileMenuTrigger } from './mobile-menu'
import { SITE_NAME } from '@/lib/constants/site'

const NAV_LINKS = [
  { label: 'Colección', href: '/productos' },
  { label: 'Novedades', href: '/productos?sort=newest' },
  { label: 'Accesorios', href: '/productos?category=accesorios' },
  { label: 'Quiénes somos', href: '/quienes-somos' },
]

export function Navbar() {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <Container>
        <nav className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-medium tracking-widest uppercase text-foreground"
          >
            {SITE_NAME}
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            <SearchBar />
            <UserMenu />
            <CartIcon />
            <MobileMenuTrigger links={NAV_LINKS} />
          </div>
        </nav>
      </Container>
    </header>
  )
}
