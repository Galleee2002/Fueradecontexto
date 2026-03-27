import { AdminPagination } from './admin-pagination'
import type { AdminOrder } from '../types'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  paid: 'bg-green-50 text-green-700 border-green-200',
  shipped: 'bg-blue-50 text-blue-700 border-blue-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

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
              <th className="py-3 px-4 text-left text-2xs font-medium tracking-widest uppercase text-muted-foreground hidden md:table-cell">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => {
              const statusClass =
                STATUS_STYLES[order.status] ?? 'bg-surface text-muted-foreground border-border'
              const statusLabel = STATUS_LABELS[order.status] ?? order.status

              return (
                <tr key={order.id} className="hover:bg-surface/60 transition-colors">
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
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('es-AR')}
                    </span>
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
