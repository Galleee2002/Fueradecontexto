import {
  fetchAdminCategories,
  fetchAdminStampLocations,
} from '@/features/admin/queries/admin-queries'
import { ProductForm } from '@/features/admin/components/product-form'

export default async function NuevoProductoPage() {
  const [categories, stampLocations] = await Promise.all([
    fetchAdminCategories(),
    fetchAdminStampLocations(),
  ])

  return (
    <div className="p-6 lg:p-8">
      <ProductForm categories={categories} stampLocations={stampLocations} />
    </div>
  )
}
