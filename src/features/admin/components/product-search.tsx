'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useRef } from 'react'
import { Search, X } from 'lucide-react'

interface ProductSearchProps {
  defaultValue?: string | undefined
}

export function ProductSearch({ defaultValue }: ProductSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const navigate = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set('search', value)
      } else {
        params.delete('search')
      }
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => navigate(e.target.value), 350)
  }

  function handleClear() {
    navigate('')
  }

  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
      </span>
      <input
        key={defaultValue}
        type="text"
        placeholder="Buscar por nombre..."
        defaultValue={defaultValue}
        onChange={handleChange}
        className="brand-input pl-9 pr-8"
      />
      {defaultValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      )}
    </div>
  )
}
