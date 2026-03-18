'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function useProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const category = searchParams.get('category') ?? undefined
  const sort = (searchParams.get('sort') ?? undefined) as
    | 'newest'
    | 'price-asc'
    | 'price-desc'
    | undefined

  function buildUrl(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString())
    // Always reset to page 1 when filters change
    params.delete('page')
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    const qs = params.toString()
    return qs ? `/productos?${qs}` : '/productos'
  }

  const setCategory = useCallback(
    (value: string | undefined) => {
      router.push(buildUrl({ category: value }))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  )

  const setSort = useCallback(
    (value: string | undefined) => {
      router.push(buildUrl({ sort: value }))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  )

  const resetFilters = useCallback(() => {
    router.push('/productos')
  }, [router])

  const hasFilters = Boolean(category ?? sort)

  return { category, sort, setCategory, setSort, resetFilters, hasFilters }
}
