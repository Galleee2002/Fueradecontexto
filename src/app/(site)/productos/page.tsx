import { ProductGrid } from '@/features/products/components/product-grid'
import { ProductFilters } from '@/features/products/components/product-filters'
import { ProductPagination } from '@/features/products/components/product-pagination'
import { MobileFilterDrawer } from '@/features/products/components/mobile-filter-drawer'
import { fetchProducts, fetchProductCategories } from '@/features/products/queries/product-queries'
import { ServicesStrip } from '@/features/home/components/services-strip'
import { Container } from '@/components/shared/layout/container'
import { PageHeader } from '@/components/shared/layout/page-header'
import { SearchBar } from '@/features/navigation/components/search-bar'
import type { ProductFilters as ProductFiltersType } from '@/features/products/types'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; page?: string }>
}) {
  const { category, sort, page } = await searchParams
  const currentPage = Math.max(1, Number(page ?? 1))

  const filters: ProductFiltersType = {
    ...(category ? { category } : {}),
    ...(sort === 'price-asc' || sort === 'price-desc' || sort === 'newest' ? { sort } : {}),
  }

  const [{ products, total, totalPages }, categories] = await Promise.all([
    fetchProducts(filters, currentPage),
    fetchProductCategories(),
  ])

  return (
    <main className="pb-20 lg:pb-0">
      <MobileFilterDrawer categories={categories} />
      <Container>
        <PageHeader
          title="Colección"
          breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Productos' }]}
          right={<SearchBar />}
        />
        <div className="flex gap-8 py-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <ProductFilters categories={categories} />
          </aside>
          <div className="flex-1 space-y-8">
            <ProductGrid products={products} />
            <ProductPagination
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
            />
          </div>
        </div>
      </Container>
      <ServicesStrip />
    </main>
  )
}
