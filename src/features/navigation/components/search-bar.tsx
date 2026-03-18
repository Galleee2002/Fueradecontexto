'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

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
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => {
              if (!query) setOpen(false)
            }}
            placeholder="Buscar..."
            className="border-b border-foreground bg-transparent text-sm py-1 pr-8 focus:outline-none w-40 placeholder:text-muted-foreground"
          />
        </form>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="text-foreground hover:text-primary transition-colors"
          aria-label="Buscar"
        >
          <Search className="h-5 w-5 stroke-[1.5]" />
        </button>
      )}
    </div>
  )
}
