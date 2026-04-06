'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { Container } from '@/components/shared/layout/container'
import { UserMenu } from '@/features/auth/components/user-menu'
import { CartIcon } from './cart-icon'
import { MobileMenuTrigger } from './mobile-menu'
import { SITE_NAME } from '@/lib/constants/site'

export function Navbar({ categories }: { categories: string[] }) {
  const [productsOpen, setProductsOpen] = useState(false)

  const CATEGORIES = categories.map((label) => ({
    label,
    href: `/productos?category=${encodeURIComponent(label.toLowerCase())}`,
  }))

  const NAV_LINKS = [
    { label: 'Explorar', href: '/productos', children: CATEGORIES },
    { label: 'Talles', href: '/talles' },
    { label: 'Ayuda', href: '/ayuda' },
  ]

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
            {/* Productos con dropdown de categorías */}
            <li
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <Link
                href="/productos"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide"
              >
                Explorar
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-200${productsOpen ? ' rotate-180' : ''}`}
                />
              </Link>

              {productsOpen && (
                <div className="absolute top-full left-0 pt-2 z-50 min-w-[180px]">
                  <ul className="bg-background border border-border shadow-lg rounded-xl py-1.5 overflow-hidden">
                    {CATEGORIES.map((cat) => (
                      <li key={cat.href}>
                        <Link
                          href={cat.href}
                          className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-surface transition-colors tracking-wide"
                        >
                          {cat.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>

            <li>
              <Link
                href="/talles"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide"
              >
                Talles
              </Link>
            </li>
            <li>
              <Link
                href="/ayuda"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide"
              >
                Ayuda
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-5">
            <UserMenu />
            <CartIcon />
            <MobileMenuTrigger links={NAV_LINKS} />
          </div>
        </nav>
      </Container>
    </header>
  )
}
