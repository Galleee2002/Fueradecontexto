'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

interface AdminPaginationProps {
  currentPage: number
  totalPages: number
  total: number
}

export function AdminPagination({ currentPage, totalPages, total }: AdminPaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-between py-3">
      <p className="text-xs text-muted-foreground">
        Página {currentPage} de {totalPages} — {total} productos
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            'p-2 border border-border transition-colors',
            currentPage <= 1
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:bg-surface hover:border-foreground',
          )}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={cn(
            'p-2 border border-border transition-colors',
            currentPage >= totalPages
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:bg-surface hover:border-foreground',
          )}
          aria-label="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}
