'use client'

import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/productos?search=${encodeURIComponent(query.trim())}`)
      setOpen(false)
      setQuery('')
    }
  }

  return (
    <div className="relative">
      {open ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="site-search" className="sr-only">
            Buscar productos
          </label>
          <input
            ref={inputRef}
            id="site-search"
            name="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setOpen(false)
              }
            }}
            onBlur={() => {
              if (!query) setOpen(false)
            }}
            placeholder="Buscar productos…"
            className="brand-input h-11 w-52 pr-10"
          />
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-transparent text-foreground transition-colors hover:border-border hover:bg-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Buscar"
        >
          <Search className="h-5 w-5 stroke-[1.5]" />
        </button>
      )}
    </div>
  )
}
