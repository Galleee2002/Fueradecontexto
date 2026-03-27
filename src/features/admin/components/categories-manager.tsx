'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { Plus, Trash2, AlertTriangle, Tag, Loader2, PackageX, Pencil, Check, X } from 'lucide-react'
import { createCategory, renameCategory, deleteCategory } from '../actions/category-actions'
import { cn } from '@/lib/utils/cn'

interface CategoryRow {
  name: string
  count: number
}

// ── Inline rename row ────────────────────────────────────────────────────────

function CategoryRow({
  cat,
  isLast,
}: {
  cat: CategoryRow
  isLast: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [renameValue, setRenameValue] = useState(cat.name)
  const [renameError, setRenameError] = useState('')
  const [isRenamePending, startRename] = useTransition()

  const [confirming, setConfirming] = useState(false)
  const [isDeletePending, startDelete] = useTransition()

  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      editInputRef.current?.select()
    }
  }, [editing])

  function openEdit() {
    setRenameValue(cat.name)
    setRenameError('')
    setEditing(true)
    setConfirming(false)
  }

  function cancelEdit() {
    setEditing(false)
    setRenameError('')
  }

  function handleRename(e: React.FormEvent) {
    e.preventDefault()
    setRenameError('')
    startRename(async () => {
      const result = await renameCategory(cat.name, renameValue)
      if (result?.error) {
        setRenameError(result.error)
        editInputRef.current?.focus()
      } else {
        setEditing(false)
      }
    })
  }

  function handleDelete() {
    startDelete(async () => {
      await deleteCategory(cat.name)
      setConfirming(false)
    })
  }

  return (
    <li
      className={cn(
        'px-6 py-4',
        !isLast && 'border-b border-border',
      )}
    >
      {editing ? (
        /* ── Edit mode ── */
        <form onSubmit={handleRename} className="flex items-start gap-3">
          <Tag className="h-4 w-4 text-primary shrink-0 mt-2.5" strokeWidth={1.5} />
          <div className="flex-1 space-y-1">
            <input
              ref={editInputRef}
              type="text"
              value={renameValue}
              onChange={(e) => { setRenameValue(e.target.value); setRenameError('') }}
              maxLength={60}
              autoComplete="off"
              className={cn(
                'w-full px-2 py-1.5 border bg-background text-sm focus:outline-none focus:ring-1 rounded-none',
                renameError
                  ? 'border-primary focus:ring-primary'
                  : 'border-border focus:border-primary focus:ring-primary',
              )}
            />
            {renameError && (
              <p className="text-xs text-primary" role="alert">{renameError}</p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0 mt-0.5">
            <button
              type="submit"
              disabled={isRenamePending}
              aria-label="Guardar nombre"
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              {isRenamePending
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Check className="h-4 w-4" strokeWidth={1.5} />}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              aria-label="Cancelar"
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </form>
      ) : confirming ? (
        /* ── Delete confirm mode ── */
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <AlertTriangle className="h-4 w-4 text-primary shrink-0" strokeWidth={1.5} />
            <div className="min-w-0">
              <span className="text-sm font-medium text-foreground">{cat.name}</span>
              {cat.count > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {cat.count} producto{cat.count === 1 ? '' : 's'} quedará{cat.count === 1 ? '' : 'n'} sin categoría
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDelete}
              disabled={isDeletePending}
              className="text-xs font-medium text-primary-foreground bg-foreground px-2.5 py-1 hover:bg-primary transition-colors disabled:opacity-50"
            >
              {isDeletePending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Eliminar'}
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        /* ── Normal mode ── */
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Tag className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
            <span className="text-sm font-medium text-foreground truncate">{cat.name}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span
              className={cn(
                'text-xs tabular-nums mr-3',
                cat.count > 0 ? 'text-muted-foreground' : 'text-muted-foreground/40',
              )}
            >
              {cat.count === 0 ? 'Sin productos' : `${cat.count} producto${cat.count === 1 ? '' : 's'}`}
            </span>
            {/* Edit */}
            <button
              onClick={openEdit}
              aria-label={`Renombrar ${cat.name}`}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-none"
            >
              <Pencil className="h-4 w-4" strokeWidth={1.5} />
            </button>
            {/* Delete */}
            <button
              onClick={() => setConfirming(true)}
              aria-label={`Eliminar ${cat.name}`}
              className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-none"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </li>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function CategoriesManager({ categories }: { categories: CategoryRow[] }) {
  const [isPending, startTransition] = useTransition()
  const [inputValue, setInputValue] = useState('')
  const [formError, setFormError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!inputValue.trim()) {
      setFormError('Ingresá un nombre para la categoría.')
      inputRef.current?.focus()
      return
    }
    startTransition(async () => {
      const result = await createCategory(inputValue)
      if (result?.error) {
        setFormError(result.error)
        inputRef.current?.focus()
      } else {
        setInputValue('')
        inputRef.current?.focus()
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="bg-background border border-border p-6">
        <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground border-b border-border pb-3 mb-5">
          Nueva categoría
        </p>
        <form onSubmit={handleAdd} className="flex gap-3 items-start">
          <div className="flex-1 space-y-1.5">
            <label
              htmlFor="category-name"
              className="block text-2xs font-medium tracking-widest uppercase text-muted-foreground"
            >
              Nombre
            </label>
            <input
              id="category-name"
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setFormError('') }}
              placeholder="Ej: Pantalones"
              maxLength={60}
              autoComplete="off"
              className={cn(
                'w-full px-3 py-2.5 border bg-background text-sm focus:outline-none focus:ring-1 rounded-none placeholder:text-muted-foreground',
                formError
                  ? 'border-primary focus:ring-primary'
                  : 'border-border focus:border-primary focus:ring-primary',
              )}
            />
            {formError && <p className="text-xs text-primary" role="alert">{formError}</p>}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="mt-[26px] flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 text-xs font-medium tracking-widest uppercase hover:bg-primary-hover transition-colors rounded-none disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" strokeWidth={2} />}
            Agregar
          </button>
        </form>
      </div>

      {/* Category list */}
      <div className="bg-background border border-border">
        <div className="px-6 py-3 border-b border-border">
          <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground">
            Categorías existentes
            <span className="ml-2 font-normal text-foreground">{categories.length}</span>
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
            <PackageX className="h-8 w-8 opacity-30" strokeWidth={1} />
            <p className="text-sm">No hay categorías todavía.</p>
            <p className="text-xs opacity-70">Agregá una arriba para empezar.</p>
          </div>
        ) : (
          <ul>
            {categories.map((cat, i) => (
              <CategoryRow key={cat.name} cat={cat} isLast={i === categories.length - 1} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
