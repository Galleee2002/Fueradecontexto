'use client'

import Link from 'next/link'
import { User } from 'lucide-react'

export function UserMenu() {
  return (
    <Link
      href="/cuenta"
      className="text-foreground hover:text-primary transition-colors"
      aria-label="Mi cuenta"
    >
      <User className="h-5 w-5 stroke-[1.5]" />
    </Link>
  )
}
