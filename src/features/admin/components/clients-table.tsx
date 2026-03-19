import type { AdminClient } from '../types'

interface ClientsTableProps {
  clients: AdminClient[]
}

export function ClientsTable({ clients }: ClientsTableProps) {
  if (clients.length === 0) {
    return (
      <div className="border border-border bg-background py-20 text-center">
        <p className="text-muted-foreground text-sm">No hay clientes todavía.</p>
      </div>
    )
  }

  return (
    <div className="border border-border bg-background overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface">
            <th className="py-3 px-4 text-left text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
              Cliente
            </th>
            <th className="py-3 px-4 text-left text-[10px] font-medium tracking-widest uppercase text-muted-foreground hidden sm:table-cell">
              Órdenes
            </th>
            <th className="py-3 px-4 text-left text-[10px] font-medium tracking-widest uppercase text-muted-foreground hidden sm:table-cell">
              Total gastado
            </th>
            <th className="py-3 px-4 text-left text-[10px] font-medium tracking-widest uppercase text-muted-foreground hidden md:table-cell">
              Última orden
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {clients.map((client) => (
            <tr key={client.customerEmail} className="hover:bg-surface/60 transition-colors">
              <td className="py-3 px-4 max-w-[240px]">
                <p className="font-medium text-foreground line-clamp-1">{client.customerName}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{client.customerEmail}</p>
              </td>
              <td className="py-3 px-4 hidden sm:table-cell">
                <span className="tabular-nums text-muted-foreground">{client.totalOrders}</span>
              </td>
              <td className="py-3 px-4 hidden sm:table-cell">
                <span className="font-semibold text-foreground tabular-nums">
                  ${client.totalSpent.toLocaleString('es-AR')}
                </span>
              </td>
              <td className="py-3 px-4 hidden md:table-cell">
                <span className="text-xs text-muted-foreground">
                  {new Date(client.lastOrderAt).toLocaleDateString('es-AR')}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
