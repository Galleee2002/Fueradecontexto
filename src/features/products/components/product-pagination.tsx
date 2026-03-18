'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductPaginationProps {
  currentPage: number
  totalPages: number
  total: number
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '...')[] = [1]

  if (current > 3) pages.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('...')

  pages.push(total)

  return pages
}

export function ProductPagination({ currentPage, totalPages, total }: ProductPaginationProps) {
  const searchParams = useSearchParams()

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    return `/productos?${params.toString()}`
  }

  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
      <p className="text-sm text-muted-foreground">
        {total} producto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
      </p>

      <nav aria-label="Paginación" className="flex items-center gap-1">
        <Link
          href={buildHref(currentPage - 1)}
          aria-label="Página anterior"
          aria-disabled={currentPage <= 1}
          className={`inline-flex items-center justify-center h-9 w-9 rounded-none text-sm font-medium transition-colors ${
            currentPage <= 1
              ? 'pointer-events-none text-muted-foreground/40'
              : 'text-foreground hover:bg-surface'
          }`}
        >
          <ChevronLeft className="h-4 w-4 stroke-[1.5]" />
        </Link>

        {pages.map((page, idx) =>
          page === '...' ? (
            <span
              key={`ellipsis-${idx}`}
              className="inline-flex items-center justify-center h-9 w-9 text-sm text-muted-foreground select-none"
            >
              …
            </span>
          ) : (
            <Link
              key={page}
              href={buildHref(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`inline-flex items-center justify-center h-9 w-9 rounded-none text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-foreground text-background'
                  : 'text-foreground hover:bg-surface'
              }`}
            >
              {page}
            </Link>
          )
        )}

        <Link
          href={buildHref(currentPage + 1)}
          aria-label="Página siguiente"
          aria-disabled={currentPage >= totalPages}
          className={`inline-flex items-center justify-center h-9 w-9 rounded-none text-sm font-medium transition-colors ${
            currentPage >= totalPages
              ? 'pointer-events-none text-muted-foreground/40'
              : 'text-foreground hover:bg-surface'
          }`}
        >
          <ChevronRight className="h-4 w-4 stroke-[1.5]" />
        </Link>
      </nav>
    </div>
  )
}
