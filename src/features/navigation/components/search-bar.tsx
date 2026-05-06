'use client'

import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export function SearchBar() {
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const raw = String(data.get('search') ?? '').trim()
    if (raw) {
      router.push(`/productos?search=${encodeURIComponent(raw)}`)
      form.reset()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <label htmlFor="site-search" className="sr-only">
        Buscar productos
      </label>
      <span
        className="pointer-events-none absolute inset-y-0 left-4 z-10 flex w-10 items-center justify-center"
        aria-hidden="true"
      >
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
      </span>
      <input
        id="site-search"
        name="search"
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        placeholder="Buscar productos…"
        className="brand-input box-border h-11 w-full !py-0 !pl-14 !pr-4 leading-[2.75rem]"
      />
    </form>
  )
}
