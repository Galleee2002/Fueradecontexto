import Image from 'next/image'
import Link from 'next/link'
import { AlertCircle, CheckCircle2, Pencil } from 'lucide-react'
import { formatPrice } from '@/shared/lib/format-price'
import { STAMP_UPCHARGES, isCapCategory } from '@/features/products/lib/stamp-pricing'
import { ToggleActiveButton } from './toggle-active-button'
import { DeleteProductButton } from './delete-product-button'
import { AdminPagination } from './admin-pagination'
import type { AdminProduct } from '../types'

const STAMP_UPCHARGE_ORDER = ['Hasta 10 cm', '20x30', '30x40', '40x50'] as const

function formatUpchargeShort(value: number) {
  if (value >= 1000 && value % 1000 === 0) {
    return `+$${value / 1000}k`
  }
  return `+${formatPrice(value)}`
}

function buildUpchargeSummary(stampSizes: string[]) {
  const available = STAMP_UPCHARGE_ORDER.filter((size) => stampSizes.includes(size))
  if (available.length === 0) return null

  const short = available.map((size) => formatUpchargeShort(STAMP_UPCHARGES[size] ?? 0)).join(' / ')
  const detailed = available
    .map((size) => `${size}: +${formatPrice(STAMP_UPCHARGES[size] ?? 0)}`)
    .join(' · ')

  return { short, detailed }
}

interface ProductsTableProps {
  products: AdminProduct[]
  currentPage: number
  totalPages: number
  total: number
}

export function ProductsTable({ products, currentPage, totalPages, total }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="brand-panel-solid py-20 text-center">
        <p className="text-muted-foreground text-sm">No se encontraron productos.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="brand-panel-solid overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="py-3 px-4 text-left text-2xs font-medium tracking-widest uppercase text-muted-foreground w-14">
                Img
              </th>
              <th className="py-3 px-4 text-left text-2xs font-medium tracking-widest uppercase text-muted-foreground">
                Nombre
              </th>
              <th className="py-3 px-4 text-left text-2xs font-medium tracking-widest uppercase text-muted-foreground hidden md:table-cell">
                Categoría
              </th>
              <th className="py-3 px-4 text-left text-2xs font-medium tracking-widest uppercase text-muted-foreground hidden sm:table-cell">
                Precio
              </th>
              <th className="py-3 px-4 text-left text-2xs font-medium tracking-widest uppercase text-muted-foreground">
                Publicación
              </th>
              <th className="py-3 px-4 text-right text-2xs font-medium tracking-widest uppercase text-muted-foreground">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr
                key={product.id}
                className="group border-b border-border/70 transition-colors hover:bg-surface/55"
              >
                {/* Thumbnail */}
                <td className="py-3 px-4">
                  <div className="w-10 h-10 bg-surface border border-border overflow-hidden shrink-0 relative">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                </td>

                {/* Name */}
                <td className="py-3 px-4 max-w-[200px]">
                  <Link
                    href={`/admin/productos/${product.id}`}
                    className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                    {product.slug}
                  </p>
                </td>

                {/* Category */}
                <td className="py-3 px-4 hidden md:table-cell">
                  <span className="text-2xs font-medium tracking-wide uppercase text-muted-foreground bg-surface border border-border px-2 py-1">
                    {product.category}
                  </span>
                </td>

                {/* Price */}
                <td className="py-3 px-4 hidden sm:table-cell align-top">
                  {(() => {
                    const upchargeSummary = isCapCategory(product.category)
                      ? null
                      : buildUpchargeSummary(product.stampSizes)
                    return (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-foreground tabular-nums">
                          ${product.price.toLocaleString('es-AR')}
                        </span>
                        {upchargeSummary && (
                          <span
                            title={`Recargos por estampa — ${upchargeSummary.detailed}`}
                            className="text-2xs text-muted-foreground tabular-nums truncate"
                          >
                            Estampa: {upchargeSummary.short}
                          </span>
                        )}
                      </div>
                    )
                  })()}
                </td>

                {/* Toggle active */}
                <td className="py-3 px-4 align-top">
                  <div className="flex items-center gap-2">
                    <ToggleActiveButton
                      id={product.id}
                      active={product.active}
                      blocker={product.quality.blockers[0] ?? null}
                    />
                    <div className="space-y-1">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-[0.18em] uppercase ${
                        product.quality.status === 'ready'
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700'
                          : product.quality.status === 'attention'
                            ? 'border-amber-500/25 bg-amber-500/10 text-amber-700'
                            : 'border-error-border bg-error-subtle text-error-foreground'
                      }`}>
                        {product.quality.status === 'ready' ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5" />
                        )}
                        {product.active ? 'Activo' : 'Borrador'}
                      </span>
                      <p className="hidden max-w-[15rem] text-[11px] leading-relaxed text-muted-foreground xl:block">
                        {product.quality.blockers[0] ?? product.quality.warnings[0] ?? 'Listo para publicar y sostener la tienda.'}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/productos/${product.id}`}
                      aria-label={`Editar ${product.name}`}
                      className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil className="h-4 w-4" strokeWidth={1.5} />
                    </Link>
                    <DeleteProductButton id={product.id} name={product.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <AdminPagination currentPage={currentPage} totalPages={totalPages} total={total} />
      )}
    </div>
  )
}
