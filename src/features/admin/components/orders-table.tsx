import { AdminPagination } from './admin-pagination'
import { DeleteOrderButton } from './delete-order-button'
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from '@/shared/config/orders'
import { ORDER_SHIPPING_STATUS_LABELS, ORDER_SHIPPING_STATUS_STYLES } from '@/shared/config/shipping'
import type { AdminOrder } from '../types'
import { SyncOrderTrackingButton } from './sync-order-tracking-button'
import { formatPrice } from '@/shared/lib/format-price'

interface OrdersTableProps {
  orders: AdminOrder[]
  currentPage: number
  totalPages: number
  total: number
}

export function OrdersTable({ orders, currentPage, totalPages, total }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="border border-border bg-background py-20 text-center">
        <p className="text-muted-foreground text-sm">No hay órdenes todavía.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="border border-border bg-background overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="py-3 px-4 text-left text-2xs font-medium tracking-widest uppercase text-muted-foreground">
                ID
              </th>
              <th className="py-3 px-4 text-left text-2xs font-medium tracking-widest uppercase text-muted-foreground">
                Cliente
              </th>
              <th className="py-3 px-4 text-left text-2xs font-medium tracking-widest uppercase text-muted-foreground hidden sm:table-cell">
                Items
              </th>
              <th className="py-3 px-4 text-left text-2xs font-medium tracking-widest uppercase text-muted-foreground hidden sm:table-cell">
                Total
              </th>
              <th className="py-3 px-4 text-left text-2xs font-medium tracking-widest uppercase text-muted-foreground">
                Estado
              </th>
              <th className="py-3 px-4 text-left text-2xs font-medium tracking-widest uppercase text-muted-foreground hidden lg:table-cell">
                Envío
              </th>
              <th className="py-3 px-4 text-left text-2xs font-medium tracking-widest uppercase text-muted-foreground hidden md:table-cell">
                Fecha
              </th>
              <th className="w-24 py-3 px-4 text-right text-2xs font-medium tracking-widest uppercase text-muted-foreground">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => {
              const statusClass =
                ORDER_STATUS_STYLES[order.status] ?? 'bg-surface text-muted-foreground border-border'
              const statusLabel = ORDER_STATUS_LABELS[order.status] ?? order.status
              const shippingStatusClass =
                ORDER_SHIPPING_STATUS_STYLES[order.shippingStatus as keyof typeof ORDER_SHIPPING_STATUS_STYLES] ??
                'bg-surface text-muted-foreground border-border'
              const shippingStatusLabel =
                ORDER_SHIPPING_STATUS_LABELS[order.shippingStatus as keyof typeof ORDER_SHIPPING_STATUS_LABELS] ??
                order.shippingStatus

              return (
                <tr key={order.id} className="group hover:bg-surface/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs text-muted-foreground">
                      {order.id.slice(0, 8)}…
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-[200px]">
                    <p className="font-medium text-foreground line-clamp-1">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{order.customerEmail}</p>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className="text-muted-foreground tabular-nums">{order.itemCount}</span>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className="font-semibold text-foreground tabular-nums">
                      ${order.total.toLocaleString('es-AR')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block border px-2 py-0.5 text-2xs font-medium tracking-wide uppercase ${statusClass}`}
                    >
                      {statusLabel}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-foreground">{order.shippingMethodLabel}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.shippingCost != null ? formatPrice(order.shippingCost) : 'Sin cotización'}
                      </p>
                      <span
                        className={`inline-block border px-2 py-0.5 text-2xs font-medium tracking-wide uppercase ${shippingStatusClass}`}
                      >
                        {shippingStatusLabel}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {order.trackingNumber ?? order.shippingLastEvent ?? 'Tracking pendiente'}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('es-AR')}
                    </span>
                  </td>
                  <td className="w-24 py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <SyncOrderTrackingButton id={order.id} disabled={!order.trackingNumber} />
                      <DeleteOrderButton id={order.id} customerName={order.customerName} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <AdminPagination currentPage={currentPage} totalPages={totalPages} total={total} />
      )}
    </div>
  )
}
