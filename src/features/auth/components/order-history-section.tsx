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

/** Nombre guardado en cuenta, o parte local del email si no hay nombre. */
function resolveAccountDisplayName(user: { name?: string | null; email?: string | null }): string {
  const name = user.name?.trim()
  if (name && name.length > 0) return name

  const email = user.email?.trim().toLowerCase()
  if (email?.includes('@')) {
    const local = email.split('@')[0]?.trim()
    if (local && local.length > 0) {
      return local.replace(/[._]+/g, ' ').replace(/\s+/g, ' ').trim()
    }
  }

  return ''
}

export function OrderHistorySection({ user, orders }: OrderHistorySectionProps) {
  const displayName = resolveAccountDisplayName(user)
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
        <header className="border-b border-border pb-6 text-center sm:pb-7">
          <h1 className="min-w-0 text-3xl font-medium tracking-[-0.05em] sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Mi Cuenta
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base leading-snug text-muted-foreground">
            {displayName ? (
              <>
                Bienvenido/a,{' '}
                <span className="font-medium text-foreground">{displayName}</span>
              </>
            ) : (
              'Bienvenido/a'
            )}
          </p>
        </header>

        <div className="pt-6 sm:pt-8">
          <h2 className="border-b border-border pb-3 text-center text-2xs font-medium uppercase tracking-widest text-muted-foreground">
            Historial de órdenes
          </h2>

          {orders.length === 0 ? (
            <div
              className="mt-4 rounded-[18px] border border-border bg-surface/60 px-5 py-10 sm:px-8 sm:py-12"
              role="status"
              aria-live="polite"
            >
              <p className="text-center text-sm leading-relaxed text-muted-foreground">
                Todavía no realizaste ninguna compra.
              </p>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-border rounded-[18px] border border-border bg-surface">
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

        <div className="mt-6 w-full sm:mt-8">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
