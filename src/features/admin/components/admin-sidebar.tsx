'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, ShoppingBag, Users, LayoutGrid, ArrowLeft, Layers } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const NAV_LINKS = [
  { label: 'Productos', href: '/admin/productos', icon: Package },
  { label: 'Categorías', href: '/admin/categorias', icon: Layers },
  { label: 'Órdenes', href: '/admin/ordenes', icon: ShoppingBag },
  { label: 'Clientes', href: '/admin/clientes', icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 bg-background border-r border-border flex flex-col h-full">
      {/* Logo */}
      <div className="h-14 flex items-center gap-3 px-5 border-b border-border">
        <LayoutGrid className="h-4 w-4 text-primary shrink-0" strokeWidth={1.5} />
        <span className="text-xs font-medium tracking-widest uppercase text-foreground">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
          Panel
        </p>
        <ul className="space-y-0.5">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-none',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface',
                  )}
                >
                  <Icon
                    className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary' : '')}
                    strokeWidth={1.5}
                  />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Back to site */}
      <div className="p-4 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          Ver sitio
        </Link>
      </div>
    </aside>
  )
}
