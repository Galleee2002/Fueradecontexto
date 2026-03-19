'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { User, ChevronDown } from 'lucide-react'
import { useSession } from 'next-auth/react'

export function UserMenu() {
  const { data: session } = useSession()
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

  if (!session) {
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
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 text-foreground hover:text-primary transition-colors"
        aria-label="Mi cuenta"
      >
        <User className="h-5 w-5 stroke-[1.5]" />
        <ChevronDown
          className="h-3 w-3 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)' }}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full pt-3 z-50 min-w-[160px]">
          <ul className="bg-background border border-border shadow-sm py-1">
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
