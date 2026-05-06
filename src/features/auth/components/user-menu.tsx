'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { User, ChevronDown } from 'lucide-react'
import { useSession } from 'next-auth/react'

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

  const isAdmin = session.user.role === 'ADMIN'

  return (
    <div className="relative z-[60]" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-0.5 text-foreground hover:text-primary transition-colors sm:gap-1"
        aria-label="Mi cuenta"
      >
        <User className="h-5 w-5 shrink-0 stroke-[1.5]" />
        <ChevronDown
          className={`hidden h-3 w-3 shrink-0 transition-transform duration-200 sm:block${open ? ' rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full pt-2 z-[70] min-w-[160px]">
          <ul className="bg-background border border-border shadow-lg rounded-xl py-1.5 overflow-hidden">
            <li>
              <Link
                href="/cuenta"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-surface transition-colors tracking-wide"
              >
                Mi cuenta
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-surface transition-colors tracking-wide"
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
