'use client'
import { useEffect, useId, useRef, useState } from 'react'
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
  const menuRef = useRef<HTMLLIElement>(null)
  const cartAreaRef = useRef<HTMLDivElement>(null)
  const dropdownId = useId()

  const CATEGORIES = categories.map((label) => ({
    label,
    href: `/productos?category=${encodeURIComponent(label)}`,
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

  useEffect(() => {
    if (!productsOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProductsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [productsOpen])

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
              ref={menuRef}
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <div className="flex items-center">
                <Link
                  href="/productos"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide"
                >
                  Explorar
                </Link>
                <button
                  type="button"
                  aria-label="Mostrar categorías"
                  aria-haspopup="menu"
                  aria-expanded={productsOpen}
                  aria-controls={dropdownId}
                  onClick={() => setProductsOpen((current) => !current)}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setProductsOpen(true)
                    }

                    if (event.key === 'Escape') {
                      setProductsOpen(false)
                    }
                  }}
                  className="ml-1 inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-3 w-3 transition-transform duration-200${productsOpen ? ' rotate-180' : ''}`}
                  />
                </button>
              </div>

              {productsOpen && (
                <div className="absolute top-full left-0 pt-2 z-50 min-w-[180px]">
                  <ul
                    id={dropdownId}
                    role="menu"
                    className="bg-background border border-border shadow-lg rounded-xl py-1.5 overflow-hidden"
                  >
                    {CATEGORIES.map((cat) => (
                      <li key={cat.href}>
                        <Link
                          href={cat.href}
                          role="menuitem"
                          onClick={() => setProductsOpen(false)}
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
