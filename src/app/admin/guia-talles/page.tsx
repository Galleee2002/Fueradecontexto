import { fetchAdminCategories, fetchSizeGuides } from '@/features/admin/queries/admin-queries'
import { SizeGuideManager } from '@/features/admin/components/size-guide-manager'

export default async function AdminGuiaTallesPage() {
  const [categories, guides] = await Promise.all([
    fetchAdminCategories(),
    fetchSizeGuides(),
  ])

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Guía de talles</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Creá y editá tablas de talles por categoría. Aparecerán en el detalle de producto.
        </p>
      </div>
      <SizeGuideManager guides={guides} categories={categories.map(c => c.name)} />
    </div>
  )
}
