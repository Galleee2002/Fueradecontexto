import { fetchAdminOrders } from '@/features/admin/queries/admin-queries'
import { OrdersTable } from '@/features/admin/components/orders-table'
import { StatsCard } from '@/features/admin/components/stats-card'

interface SearchParams {
  page?: string
}

export default async function AdminOrdenesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { page } = await searchParams
  const currentPage = Math.max(1, Number(page ?? 1))

  const { orders, total, totalPages } = await fetchAdminOrders(currentPage)

  const pending = orders.filter((o) => o.status === 'pending').length
  const paid = orders.filter((o) => o.status === 'paid').length

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-foreground">Órdenes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {total} {total === 1 ? 'orden' : 'órdenes'} en total
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard label="Total" value={total} />
        <StatsCard label="Pendientes" value={pending} accent />
        <StatsCard label="Pagadas" value={paid} />
        <StatsCard label="Página" value={`${currentPage}/${totalPages || 1}`} />
      </div>

      <OrdersTable
        orders={orders}
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
      />
    </div>
  )
}
