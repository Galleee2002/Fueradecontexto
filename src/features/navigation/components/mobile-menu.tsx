'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'

export type NavLink = { label: string; href: string; children?: NavLink[] }

interface MobileMenuTriggerProps {
  links: NavLink[]
}

export function MobileMenuTrigger({ links }: MobileMenuTriggerProps) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
    setExpanded(null)
  }, [pathname])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        setExpanded(null)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex h-9 w-9 items-center justify-center text-foreground hover:text-primary transition-colors"
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
            onClick={() => {
              setOpen(false)
              setExpanded(null)
            }}
            className="fixed inset-0 top-14 sm:top-16 z-40 bg-foreground/25"
          />

          <div
            id="mobile-menu-panel"
            className="fixed inset-x-0 top-14 sm:top-16 z-50 bg-background border-b border-border max-h-[calc(100svh-3.5rem)] sm:max-h-[calc(100svh-4rem)] overflow-y-auto"
          >
            <div className="px-4 py-5">
              <ul className="space-y-3">
                {links.map((link) =>
                  link.children ? (
                    <li key={link.href} className="border-b border-border pb-3">
                      <button
                        type="button"
                        onClick={() => setExpanded(expanded === link.href ? null : link.href)}
                        className="flex items-center justify-between w-full text-lg font-normal font-serif hover:text-primary transition-colors"
                      >
                        {link.label}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200${expanded === link.href ? ' rotate-180' : ''}`}
                        />
                      </button>
                      {expanded === link.href && (
                        <ul className="mt-3 pl-4 space-y-3 border-l border-border">
                          {link.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={() => setOpen(false)}
                                className="text-base text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ) : (
                    <li key={link.href} className="border-b border-border pb-3">
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="text-lg font-normal font-serif block hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
