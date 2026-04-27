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
    <div className="brand-panel-solid flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
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
              className="inline-flex h-10 w-10 select-none items-center justify-center text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <Link
              key={page}
              href={buildHref(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
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
