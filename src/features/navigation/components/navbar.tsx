'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { gsap } from 'gsap'
import { Container } from '@/components/shared/layout/container'
import { UserMenu } from '@/features/auth/components/user-menu'
import { CartIcon } from './cart-icon'
import { MobileMenuTrigger } from './mobile-menu'
import { SITE_NAME } from '@/lib/constants/site'

export function Navbar({ categories }: { categories: string[] }) {
  const [productsOpen, setProductsOpen] = useState(false)
  const cartAreaRef = useRef<HTMLDivElement>(null)

  const CATEGORIES = categories.map((label) => ({
    label,
    href: `/productos?category=${encodeURIComponent(label.toLowerCase())}`,
  }))

  const NAV_LINKS = [
    { label: 'Explorar', href: '/productos', children: CATEGORIES },
    { label: 'Talles', href: '/talles' },
    { label: 'Colecciones', href: '/productos' },
  ]

  useEffect(() => {
    const handleItemAdded = () => {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
      }

      const cartArea = cartAreaRef.current
      if (!cartArea) {
        return
      }

      gsap.killTweensOf(cartArea)
      const tl = gsap.timeline({ defaults: { overwrite: 'auto' } })
      tl.fromTo(
        cartArea,
        { scale: 1, y: 0, rotate: 0 },
        {
          scale: 1.15,
          y: -2,
          rotate: -4,
          duration: 0.2,
          ease: 'back.out(2.2)',
          transformOrigin: 'center center',
        },
      )
        .to(cartArea, {
          scale: 1.04,
          y: 0,
          rotate: 2,
          duration: 0.18,
          ease: 'sine.out',
        })
        .to(cartArea, {
          scale: 1,
          y: 0,
          rotate: 0,
          duration: 0.22,
          ease: 'power2.out',
        })
    }

    window.addEventListener('cart:item-added', handleItemAdded)

    return () => {
      window.removeEventListener('cart:item-added', handleItemAdded)
    }
  }, [])

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <Container>
        <nav className="flex items-center justify-between h-14 sm:h-16">
          <Link
            href="/"
            className="text-base sm:text-xl font-medium tracking-[0.12em] sm:tracking-widest uppercase text-foreground"
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

          <div className="flex items-center gap-3 sm:gap-5">
            <UserMenu />
            <div ref={cartAreaRef} data-cart-icon-target="true" className="will-change-transform">
              <CartIcon />
            </div>
            <MobileMenuTrigger links={NAV_LINKS} />
          </div>
        </nav>
      </Container>
    </header>
  )
}
