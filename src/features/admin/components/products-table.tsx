import Image from 'next/image'
import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { ToggleActiveButton } from './toggle-active-button'
import { DeleteProductButton } from './delete-product-button'
import { AdminPagination } from './admin-pagination'
import type { AdminProduct } from '../types'

interface ProductsTableProps {
  products: AdminProduct[]
  currentPage: number
  totalPages: number
  total: number
}

export function ProductsTable({ products, currentPage, totalPages, total }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="border border-border bg-background py-20 text-center">
        <p className="text-muted-foreground text-sm">No se encontraron productos.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="border border-border bg-background overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="py-3 px-4 text-left text-[10px] font-medium tracking-widest uppercase text-muted-foreground w-14">
                Img
              </th>
              <th className="py-3 px-4 text-left text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
                Nombre
              </th>
              <th className="py-3 px-4 text-left text-[10px] font-medium tracking-widest uppercase text-muted-foreground hidden md:table-cell">
                Categoría
              </th>
              <th className="py-3 px-4 text-left text-[10px] font-medium tracking-widest uppercase text-muted-foreground hidden sm:table-cell">
                Precio
              </th>
              <th className="py-3 px-4 text-left text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
                Estado
              </th>
              <th className="py-3 px-4 text-right text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-surface/60 transition-colors group"
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
                  <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                    {product.slug}
                  </p>
                </td>

                {/* Category */}
                <td className="py-3 px-4 hidden md:table-cell">
                  <span className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground bg-surface border border-border px-2 py-1">
                    {product.category}
                  </span>
                </td>

                {/* Price */}
                <td className="py-3 px-4 hidden sm:table-cell">
                  <span className="font-semibold text-foreground tabular-nums">
                    ${product.price.toLocaleString('es-AR')}
                  </span>
                </td>

                {/* Toggle active */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <ToggleActiveButton id={product.id} active={product.active} />
                    <span className={`text-[10px] font-medium tracking-wide uppercase hidden lg:block ${product.active ? 'text-primary' : 'text-muted-foreground'}`}>
                      {product.active ? 'Activo' : 'Inactivo'}
                    </span>
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
