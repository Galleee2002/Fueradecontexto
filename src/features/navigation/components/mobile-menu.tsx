'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'

export type NavLink = { label: string; href: string; children?: NavLink[] }

interface MobileMenuTriggerProps {
  links: NavLink[]
}

export function MobileMenuTrigger({ links }: MobileMenuTriggerProps) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-foreground"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-16 bg-background border-b border-border z-50 px-4 py-6">
          <ul className="space-y-4">
            {links.map((link) =>
              link.children ? (
                <li key={link.href}>
                  <button
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
                <li key={link.href}>
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
      )}
    </div>
  )
}
