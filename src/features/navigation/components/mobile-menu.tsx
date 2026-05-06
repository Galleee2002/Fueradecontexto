'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Menu, Search, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { SITE_NAME } from '@/shared/config/site'
import { SOCIAL_LINKS, WHATSAPP_NUMBER } from '@/features/navigation/constants/external-links'
import { isAdminRole } from '@/shared/infrastructure/auth/user-role'

export type NavLink = { label: string; href: string; children?: NavLink[] }

interface MobileMenuTriggerProps {
  links: NavLink[]
}

export function MobileMenuTrigger({ links }: MobileMenuTriggerProps) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const isAuthenticated = sessionStatus === 'authenticated' && Boolean(session?.user)
  const isAdmin = isAdminRole(session?.user?.role)

  const whatsappHref = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : ''

  function closeMenu() {
    setOpen(false)
    setExpanded(null)
    setQuery('')
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedQuery = query.trim()
    const target = trimmedQuery
      ? `/productos?search=${encodeURIComponent(trimmedQuery)}`
      : '/productos'

    router.push(target)
    closeMenu()
  }

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow
    const prevBodyPosition = body.style.position
    const prevBodyTop = body.style.top
    const prevBodyWidth = body.style.width
    const scrollY = window.scrollY

    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'

    return () => {
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
      body.style.position = prevBodyPosition
      body.style.top = prevBodyTop
      body.style.width = prevBodyWidth
      window.scrollTo(0, scrollY)
    }
  }, [open])

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-transparent text-foreground transition-colors hover:border-border hover:bg-surface hover:text-primary"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={closeMenu}
            className="fixed inset-0 z-[69] h-dvh max-h-dvh w-full touch-none bg-foreground/28 backdrop-blur-sm"
          />

          <div
            id="mobile-menu-panel"
            className="fixed top-0 right-0 z-[70] flex h-dvh max-h-dvh w-full max-w-md min-w-0 touch-none flex-col overflow-hidden border-l border-border bg-[rgba(245,245,247,0.96)] pt-[env(safe-area-inset-top)] shadow-[-18px_0_50px_rgba(18,24,32,0.08)] backdrop-blur-xl"
          >
            <div className="shrink-0 border-b border-border px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <Link
                  href="/"
                  onClick={() => {
                    if (pathname !== '/') {
                      closeMenu()
                    }
                  }}
                  className="text-sm font-medium uppercase tracking-[0.26em] text-foreground"
                >
                  {SITE_NAME}
                </Link>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-transparent text-foreground transition-colors hover:border-border hover:bg-surface hover:text-primary"
                  aria-label="Cerrar menú"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="mt-4">
                <label htmlFor="mobile-menu-search" className="sr-only">
                  Buscar productos
                </label>
                <div className="flex min-h-12 items-center rounded-[1.1rem] border border-border bg-surface px-4">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <input
                    id="mobile-menu-search"
                    name="search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar productos o categorías…"
                    className="h-12 w-full bg-transparent pl-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
                  />
                </div>
              </form>
            </div>

            <div className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-y-contain px-4 py-5">
              <p className="mb-3 text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
                Navegación
              </p>
              <ul>
                {links.map((link) => {
                  const children = link.children ?? []
                  const hasChildren = children.length > 0

                  return hasChildren ? (
                    <li key={`${link.href}-${link.label}`} className="border-b border-border">
                      <button
                        type="button"
                        onClick={() => setExpanded(expanded === link.href ? null : link.href)}
                        className="flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left text-[1.6rem] font-medium tracking-[-0.04em] text-foreground transition-colors hover:text-primary"
                        aria-expanded={expanded === link.href}
                        aria-controls={`mobile-submenu-${link.label.toLowerCase()}`}
                      >
                        {link.label}
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-primary transition-transform duration-200${expanded === link.href ? ' rotate-180' : ''}`}
                        />
                      </button>
                      {expanded === link.href && (
                        <ul
                          id={`mobile-submenu-${link.label.toLowerCase()}`}
                          className="space-y-2 border-t border-border py-3"
                        >
                          {children.map((child) => (
                            <li key={`${child.href}-${child.label}`}>
                              <Link
                                href={child.href}
                                onClick={() => {
                                  if (pathname !== child.href) {
                                    closeMenu()
                                  }
                                }}
                                className="flex min-h-12 items-center rounded-[1rem] bg-surface px-4 text-base font-medium text-foreground/80 transition-colors hover:text-foreground"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ) : (
                    <li key={`${link.href}-${link.label}`} className="border-b border-border">
                      <Link
                        href={link.href}
                        onClick={() => {
                          if (pathname !== link.href) {
                            closeMenu()
                          }
                        }}
                        className="flex min-h-14 items-center py-3 text-[1.6rem] font-medium tracking-[-0.04em] text-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="shrink-0 border-t border-border px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="space-y-1">
                {sessionStatus === 'loading' ? null : isAuthenticated ? (
                  <>
                    <Link
                      href="/cuenta"
                      onClick={() => {
                        if (pathname !== '/cuenta') {
                          closeMenu()
                        }
                      }}
                      className="flex min-h-12 items-center text-sm font-medium tracking-wide text-foreground transition-colors hover:text-primary"
                    >
                      Mi cuenta
                    </Link>
                    {isAdmin ? (
                      <Link
                        href="/admin"
                        onClick={() => {
                          if (!pathname.startsWith('/admin')) {
                            closeMenu()
                          }
                        }}
                        className="flex min-h-12 items-center text-sm font-medium tracking-wide text-foreground transition-colors hover:text-primary"
                      >
                        Administrador
                      </Link>
                    ) : null}
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => {
                      if (pathname !== '/login') {
                        closeMenu()
                      }
                    }}
                    className="flex min-h-12 items-center text-sm font-medium tracking-wide text-foreground transition-colors hover:text-primary"
                  >
                    Iniciar sesión
                  </Link>
                )}
                <Link
                  href="/ayuda"
                  onClick={() => {
                    if (pathname !== '/ayuda') {
                      closeMenu()
                    }
                  }}
                  className="flex min-h-12 items-center text-sm font-medium tracking-wide text-foreground transition-colors hover:text-primary"
                >
                  Ayuda
                </Link>
                {whatsappHref ? (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className="flex min-h-12 items-center text-sm font-medium tracking-wide text-foreground transition-colors hover:text-primary"
                  >
                    WhatsApp
                  </a>
                ) : null}
              </div>

              {SOCIAL_LINKS.length > 0 ? (
                <div className="mt-4 flex items-center gap-3">
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMenu}
                      aria-label={link.label}
                      className="inline-flex h-12 min-w-12 items-center justify-center rounded-full border border-border px-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {link.shortLabel}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
