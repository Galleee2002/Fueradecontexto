'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, ShoppingBag, Users, LayoutGrid, ArrowLeft, Layers, Ruler, Palette, Truck } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

const NAV_LINKS = [
  { label: 'Productos', href: '/admin/productos', icon: Package },
  { label: 'Categorías', href: '/admin/categorias', icon: Layers },
  { label: 'Colores', href: '/admin/colores', icon: Palette },
  { label: 'Guía de talles', href: '/admin/guia-talles', icon: Ruler },
  { label: 'Envíos', href: '/admin/envios', icon: Truck },
  { label: 'Órdenes', href: '/admin/ordenes', icon: ShoppingBag },
  { label: 'Clientes', href: '/admin/clientes', icon: Users },
]

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex h-dvh w-64 shrink-0 flex-col border-r border-border bg-[rgba(255,255,255,0.78)] backdrop-blur-xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-10 lg:h-dvh lg:w-60',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <LayoutGrid className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
        <span className="text-xs font-medium uppercase tracking-[0.24em] text-foreground">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <p className="mb-2 px-3 text-2xs font-medium uppercase tracking-widest text-muted-foreground">
          Panel
        </p>
        <ul className="space-y-0.5">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 rounded-full px-3 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium shadow-[0_10px_18px_rgba(0,102,204,0.08)]'
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
        <Link href="/" className="brand-button-ghost w-full justify-start gap-2 text-xs tracking-[0.18em]">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          Ver sitio
        </Link>
      </div>
    </aside>
  )
}
