import { getAdminCategoriesWithCount } from '@/features/admin/categories/application/get-admin-categories-with-count'
import { CategoriesManager } from '@/features/admin/components/categories-manager'

export default async function AdminCategoriasPage() {
  const categories = await getAdminCategoriesWithCount()

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Categorías</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Administrá las categorías de productos de la tienda.
        </p>
      </div>
      <CategoriesManager categories={categories} />
    </div>
  )
}
