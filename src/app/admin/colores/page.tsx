import { fetchAdminColors } from '@/features/admin/queries/admin-queries'
import { ColorsManager } from '@/features/admin/components/colors-manager'

export default async function AdminColoresPage() {
  const colors = await fetchAdminColors()

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Colores</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Administrá la paleta de colores global de la tienda.
        </p>
      </div>
      <ColorsManager colors={colors} />
    </div>
  )
}
