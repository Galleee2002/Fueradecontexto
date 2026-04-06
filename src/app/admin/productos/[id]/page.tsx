import { notFound } from 'next/navigation'
import {
  fetchAdminProductById,
  fetchAdminCategories,
  fetchAdminStampLocations,
  fetchAdminColors,
} from '@/features/admin/queries/admin-queries'
import { ProductForm } from '@/features/admin/components/product-form'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductoPage({ params }: EditProductPageProps) {
  const { id } = await params

  const [product, categories, stampLocations, globalColors] = await Promise.all([
    fetchAdminProductById(id),
    fetchAdminCategories(),
    fetchAdminStampLocations(),
    fetchAdminColors(),
  ])

  if (!product) notFound()

  return (
    <div className="p-6 lg:p-8">
      <ProductForm product={product} categories={categories} stampLocations={stampLocations} globalColors={globalColors} />
    </div>
  )
}
