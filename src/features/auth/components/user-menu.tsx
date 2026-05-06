'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { User, ChevronDown } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { isAdminRole } from '@/shared/infrastructure/auth/user-role'

export function UserMenu() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (status === 'loading') {
    return (
      <span
        className="inline-flex text-foreground opacity-60"
        aria-busy="true"
        aria-label="Cargando sesión"
      >
        <User className="h-5 w-5 stroke-[1.5]" />
      </span>
    )
  }

  if (status !== 'authenticated' || !session?.user) {
    return (
      <Link
        href="/login"
        className="text-foreground hover:text-primary transition-colors"
        aria-label="Iniciar sesión"
      >
        <User className="h-5 w-5 stroke-[1.5]" />
      </Link>
    )
  }

  const isAdmin = isAdminRole(session.user.role)

  return (
    <div className="relative z-[60]" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-0.5 text-foreground hover:text-primary transition-colors sm:gap-1"
        aria-label="Mi cuenta"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <User className="h-5 w-5 shrink-0 stroke-[1.5]" />
        <ChevronDown
          className={`hidden h-3 w-3 shrink-0 transition-transform duration-200 sm:block${open ? ' rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-[100] min-w-[200px] pt-2"
          role="menu"
          aria-label="Cuenta"
        >
          <ul className="overflow-hidden rounded-xl border border-border bg-background py-1.5 shadow-lg">
            <li>
              <Link
                href="/cuenta"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-muted-foreground transition-colors tracking-wide hover:bg-surface hover:text-foreground"
              >
                Mi cuenta
              </Link>
            </li>
            {isAdmin ? (
              <li>
                <Link
                  href="/admin"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm text-muted-foreground transition-colors tracking-wide hover:bg-surface hover:text-foreground"
                >
                  Administrador
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
      )}
    </div>
  )
}
