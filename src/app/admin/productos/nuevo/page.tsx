import {
  fetchAdminCategories,
  fetchAdminStampLocations,
  fetchAdminColors,
} from '@/features/admin/queries/admin-queries'
import { ProductForm } from '@/features/admin/components/product-form'

export default async function NuevoProductoPage() {
  const [categories, stampLocations, globalColors] = await Promise.all([
    fetchAdminCategories(),
    fetchAdminStampLocations(),
    fetchAdminColors(),
  ])

  return (
    <div className="p-6 lg:p-8">
      <ProductForm
        categories={categories}
        stampLocations={stampLocations}
        globalColors={globalColors}
      />
    </div>
  )
}
