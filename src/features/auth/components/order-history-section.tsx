import Link from 'next/link'
import { LogoutButton } from './logout-button'
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from '@/shared/config/orders'
import type { UserOrder } from '../queries/user-queries'

interface OrderHistorySectionProps {
  user: { name?: string | null; email?: string | null }
  orders: UserOrder[]
}

const PANEL =
  'brand-panel-solid px-6 py-7 sm:px-8 sm:py-8 lg:px-10'

export function OrderHistorySection({ user, orders }: OrderHistorySectionProps) {
  return (
    <div className="pb-12">
      <nav
        className="mb-5 flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground"
        aria-label="Migas de pan"
      >
        <Link href="/" className="transition-colors hover:text-foreground">
          Inicio
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">Cuenta</span>
      </nav>

      <div className={PANEL}>
        <div className="flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <p className="brand-kicker">Fueradecontexto</p>
            <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.05em] sm:text-5xl lg:text-[3.6rem]">
              Mi Cuenta
            </h1>
            <p className="text-lg font-medium tracking-[-0.02em] text-foreground">
              {user.name?.trim() || 'Tu perfil'}
            </p>
            {user.email ? (
              <p className="text-sm text-muted-foreground">{user.email}</p>
            ) : null}
          </div>
          <div className="shrink-0 lg:pt-1">
            <LogoutButton />
          </div>
        </div>

        <div className="pt-8">
          <h2 className="border-b border-border pb-3 text-2xs font-medium uppercase tracking-widest text-muted-foreground">
            Historial de órdenes
          </h2>

          {orders.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Todavía no realizaste ninguna compra.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-border rounded-[1.25rem] border border-border bg-surface">
              {orders.map((order) => {
                const statusClass =
                  ORDER_STATUS_STYLES[order.status] ?? 'bg-surface text-muted-foreground border-border'
                const statusLabel = ORDER_STATUS_LABELS[order.status] ?? order.status

                return (
                  <div key={order.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">{order.id.slice(0, 8)}…</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {order.itemCount} {order.itemCount === 1 ? 'artículo' : 'artículos'} ·{' '}
                        {new Date(order.createdAt).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={`inline-block border px-2 py-0.5 text-2xs font-medium uppercase tracking-wide ${statusClass}`}
                      >
                        {statusLabel}
                      </span>
                      <span className="text-sm font-semibold tabular-nums text-foreground">
                        ${order.total.toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
