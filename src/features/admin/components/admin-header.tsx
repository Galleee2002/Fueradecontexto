import { SITE_NAME } from '@/lib/constants/site'
import { Shield, Menu } from 'lucide-react'

interface AdminHeaderProps {
  onToggleSidebar: () => void
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  return (
    <header className="h-14 bg-foreground text-primary-foreground flex items-center justify-between px-6 shrink-0 border-b border-foreground/20">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden flex items-center justify-center w-8 h-8 -ml-1 mr-1 text-white/70 hover:text-white transition-colors focus:outline-none"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <Shield className="h-4 w-4 text-primary" strokeWidth={1.5} />
        <p className="text-xs font-medium tracking-widest uppercase text-white">
          {SITE_NAME} — Dashboard
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-primary-foreground/10 flex items-center justify-center">
          <span className="text-xs font-medium text-white">A</span>
        </div>
        <span className="text-xs text-white/60 hidden sm:block">Administrador</span>
      </div>
    </header>
  )
}
