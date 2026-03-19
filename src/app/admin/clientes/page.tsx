import { fetchAdminClients } from '@/features/admin/queries/admin-queries'
import { ClientsTable } from '@/features/admin/components/clients-table'
import { StatsCard } from '@/features/admin/components/stats-card'

export default async function AdminClientesPage() {
  const clients = await fetchAdminClients()

  const totalSpent = clients.reduce((sum, c) => sum + c.totalSpent, 0)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-foreground">Clientes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {clients.length} {clients.length === 1 ? 'cliente único' : 'clientes únicos'}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatsCard label="Clientes" value={clients.length} />
        <StatsCard label="Total recaudado" value={`$${totalSpent.toLocaleString('es-AR')}`} accent />
        <StatsCard
          label="Prom. por cliente"
          value={
            clients.length > 0
              ? `$${Math.round(totalSpent / clients.length).toLocaleString('es-AR')}`
              : '$0'
          }
        />
      </div>

      <ClientsTable clients={clients} />
    </div>
  )
}
