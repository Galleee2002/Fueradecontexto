import Link from 'next/link'
import { Suspense } from 'react'
import { Plus } from 'lucide-react'
import {
  fetchAdminProducts,
  fetchAdminStats,
  fetchAdminCategories,
} from '@/features/admin/queries/admin-queries'
import { ProductsTable } from '@/features/admin/components/products-table'
import { StatsCard } from '@/features/admin/components/stats-card'
import { ProductSearch } from '@/features/admin/components/product-search'
import type { AdminProductStatus } from '@/features/admin/types'

interface SearchParams {
  search?: string
  category?: string
  status?: string
  page?: string
}

function CategoryFilter({
  categories,
  current,
}: {
  categories: string[]
  current?: string | undefined
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-2xs font-medium tracking-widest uppercase text-muted-foreground shrink-0">
        Categoría:
      </span>
      <div className="flex gap-1 flex-wrap">
        <Link
          href="/admin/productos"
          className={`rounded-full px-3 py-2.5 text-xs border transition-colors focus:outline-none focus:ring-1 ${
            !current
              ? 'bg-primary text-primary-foreground border-primary hover:bg-primary-hover focus:bg-primary-hover focus:ring-primary'
              : 'border-border text-foreground hover:bg-surface hover:border-border focus:border-primary focus:ring-primary'
          }`}
        >
          Todas
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/admin/productos?category=${encodeURIComponent(cat)}`}
            className={`rounded-full px-3 py-2.5 text-xs border transition-colors focus:outline-none focus:ring-1 ${
              current === cat
                ? 'bg-primary text-primary-foreground border-primary hover:bg-primary-hover focus:bg-primary-hover focus:ring-primary'
                : 'border-border text-foreground hover:bg-surface hover:border-border focus:border-primary focus:ring-primary'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>
    </div>
  )
}

function StatusFilter({ current }: { current: AdminProductStatus }) {
  const options: { label: string; value: AdminProductStatus }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Activos', value: 'active' },
    { label: 'Inactivos', value: 'inactive' },
  ]

  return (
    <div className="flex items-center gap-2">
      <span className="text-2xs font-medium tracking-widest uppercase text-muted-foreground shrink-0">
        Estado:
      </span>
      <div className="flex flex-wrap gap-1">
        {options.map(({ label, value }) => (
          <Link
            key={value}
            href={`/admin/productos?status=${value}`}
            className={`rounded-full px-3 py-2.5 text-xs border transition-colors focus:outline-none focus:ring-1 ${
              current === value
                ? 'bg-primary text-primary-foreground border-primary hover:bg-primary-hover focus:bg-primary-hover focus:ring-primary'
                : 'border-border text-foreground hover:bg-surface hover:border-border focus:border-primary focus:ring-primary'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default async function AdminProductosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { search, category, status, page } = await searchParams
  const currentPage = Math.max(1, Number(page ?? 1))
  const statusFilter =
    status === 'active' || status === 'inactive' ? status : ('all' as AdminProductStatus)

  const [{ products, total, totalPages }, stats, categories] = await Promise.all([
    fetchAdminProducts(search, category, statusFilter, currentPage),
    fetchAdminStats(),
    fetchAdminCategories(),
  ])
  const readyProducts = products.filter((product) => product.quality.status === 'ready').length
  const productsNeedingAttention = products.filter((product) => product.quality.status !== 'ready').length

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Productos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {total} {total === 1 ? 'producto' : 'productos'} en total
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="brand-button-primary shrink-0 gap-2 px-5"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          <span className="hidden sm:inline">Nuevo producto</span>
          <span className="sm:hidden">Nuevo</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard label="Total" value={stats.totalProducts} />
        <StatsCard label="Activos" value={stats.activeProducts} accent />
        <StatsCard label="Listos" value={readyProducts} description="Sin bloqueos de publicación en esta página" />
        <StatsCard label="Revisar" value={productsNeedingAttention} description="Productos con bloqueos o alertas visibles" />
      </div>

      {/* Filters */}
      <div className="brand-panel-solid space-y-4 p-4">
        <Suspense fallback={null}>
          <ProductSearch defaultValue={search} />
        </Suspense>

        <div className="flex flex-col gap-3 pt-1 border-t border-border">
          <StatusFilter current={statusFilter} />
          <CategoryFilter categories={categories.map(c => c.name)} current={category} />
        </div>
      </div>

      {/* Table */}
      <ProductsTable
        products={products}
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
      />
    </div>
  )
}
