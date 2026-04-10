import { LogoutButton } from './logout-button'
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from '@/shared/config/orders'
import type { UserOrder } from '../queries/user-queries'

interface OrderHistorySectionProps {
  user: { name?: string | null; email?: string | null }
  orders: UserOrder[]
}

export function OrderHistorySection({ user, orders }: OrderHistorySectionProps) {
  return (
    <div className="py-12 space-y-10">
      {/* User header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-foreground">{user.name ?? 'Mi cuenta'}</h2>
          <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
        </div>
        <LogoutButton />
      </div>

      {/* Order history */}
      <div className="space-y-4">
        <h3 className="text-2xs font-medium tracking-widest uppercase text-muted-foreground border-b border-border pb-3">
          Historial de órdenes
        </h3>

        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Todavía no realizaste ninguna compra.
          </p>
        ) : (
          <div className="divide-y divide-border border border-border">
            {orders.map((order) => {
              const statusClass =
                ORDER_STATUS_STYLES[order.status] ?? 'bg-surface text-muted-foreground border-border'
              const statusLabel = ORDER_STATUS_LABELS[order.status] ?? order.status

              return (
                <div key={order.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">
                      {order.id.slice(0, 8)}…
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.itemCount} {order.itemCount === 1 ? 'artículo' : 'artículos'} ·{' '}
                      {new Date(order.createdAt).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`inline-block border px-2 py-0.5 text-2xs font-medium tracking-wide uppercase ${statusClass}`}
                    >
                      {statusLabel}
                    </span>
                    <span className="font-semibold text-foreground tabular-nums text-sm">
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
  )
}
