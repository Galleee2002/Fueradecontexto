'use client'
import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { gsap } from 'gsap'
import { Container } from '@/shared/ui/layout/container'
import { UserMenu } from '@/features/auth'
import { CartIcon } from './cart-icon'
import { MobileMenuTrigger } from './mobile-menu'
import { SITE_NAME } from '@/shared/config/site'

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
    <header className="sticky top-0 z-50 border-b border-border/80 bg-[rgba(245,245,247,0.82)] backdrop-blur-xl">
      <Container>
        <nav className="flex h-16 items-center justify-between gap-4 sm:h-[4.6rem]">
          <Link
            href="/"
            className="min-w-0 text-sm font-medium uppercase tracking-[0.34em] text-foreground transition-opacity hover:opacity-75 sm:text-[0.95rem]"
          >
            {SITE_NAME}
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
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
                  className="text-sm tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
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
                  className="ml-1 inline-flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                    className="overflow-hidden rounded-[1.15rem] border border-border bg-[rgba(255,255,255,0.88)] py-1.5 shadow-[0_16px_34px_rgba(18,24,32,0.08)] backdrop-blur-xl"
                  >
                    {CATEGORIES.map((cat) => (
                      <li key={cat.href}>
                        <Link
                          href={cat.href}
                          role="menuitem"
                          onClick={() => setProductsOpen(false)}
                          className="block px-4 py-2.5 text-sm tracking-[0.05em] text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
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
                className="text-sm tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Talles
              </Link>
            </li>
            <li>
              <Link
                href="/ayuda"
                className="text-sm tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Ayuda
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
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
