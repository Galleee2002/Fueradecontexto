import { SITE_NAME } from '@/shared/config/site'
import { Shield, Menu } from 'lucide-react'

interface AdminHeaderProps {
  onToggleSidebar: () => void
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 mx-4 mt-4 flex h-16 shrink-0 items-center justify-between rounded-2xl border border-border bg-[rgba(255,255,255,0.74)] px-6 shadow-[0_18px_40px_rgba(18,24,32,0.06)] backdrop-blur-xl lg:mx-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="mr-1 flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-foreground transition-colors hover:border-border hover:bg-surface lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <Shield className="h-4 w-4 text-primary" strokeWidth={1.5} />
        <p className="text-xs font-medium tracking-widest uppercase text-white">
          <span className="text-foreground">{SITE_NAME}</span>
          <span className="text-muted-foreground"> — Dashboard</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
          <span className="text-xs font-medium text-primary">A</span>
        </div>
        <span className="hidden text-xs text-muted-foreground sm:block">Administrador</span>
      </div>
    </header>
  )
}
