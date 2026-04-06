'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { Plus, Trash2, AlertTriangle, Tag, Loader2, PackageX, Pencil, Check, X, ChevronRight } from 'lucide-react'
import {
  createCategory,
  renameCategory,
  deleteCategory,
  addSubcategory,
  renameSubcategory,
  deleteSubcategory,
} from '../actions/category-actions'
import { cn } from '@/lib/utils/cn'

interface CategoryRow {
  name: string
  subcategories: string[]
  count: number
}

// ── Subcategory row ───────────────────────────────────────────────────────────

function SubcategoryRow({
  categoryName,
  name,
  isLast,
}: {
  categoryName: string
  name: string
  isLast: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [renameValue, setRenameValue] = useState(name)
  const [renameError, setRenameError] = useState('')
  const [isRenamePending, startRename] = useTransition()

  const [confirming, setConfirming] = useState(false)
  const [isDeletePending, startDelete] = useTransition()

  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) editInputRef.current?.select()
  }, [editing])

  function openEdit() {
    setRenameValue(name)
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
      const result = await renameSubcategory(categoryName, name, renameValue)
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
      await deleteSubcategory(categoryName, name)
      setConfirming(false)
    })
  }

  return (
    <li className={cn('pl-4 pr-2 py-2', !isLast && 'border-b border-border')}>
      {editing ? (
        <form onSubmit={handleRename} className="flex items-start gap-2">
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0 mt-2" strokeWidth={1.5} />
          <div className="flex-1 space-y-1">
            <input
              ref={editInputRef}
              type="text"
              value={renameValue}
              onChange={(e) => { setRenameValue(e.target.value); setRenameError('') }}
              maxLength={60}
              autoComplete="off"
              className={cn(
                'w-full px-2 py-1 border bg-background text-xs focus:outline-none focus:ring-1 rounded-none',
                renameError
                  ? 'border-primary focus:ring-primary'
                  : 'border-border focus:border-primary focus:ring-primary',
              )}
            />
            {renameError && (
              <p className="text-xs text-primary" role="alert">{renameError}</p>
            )}
          </div>
          <div className="flex items-center gap-0.5 shrink-0 mt-0.5">
            <button
              type="submit"
              disabled={isRenamePending}
              aria-label="Guardar"
              className="p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              {isRenamePending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" strokeWidth={1.5} />}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              aria-label="Cancelar"
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </form>
      ) : confirming ? (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="h-3.5 w-3.5 text-primary shrink-0" strokeWidth={1.5} />
            <span className="text-xs text-foreground truncate">{name}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDelete}
              disabled={isDeletePending}
              className="text-2xs font-medium text-primary-foreground bg-foreground px-2 py-0.5 hover:bg-primary transition-colors disabled:opacity-50"
            >
              {isDeletePending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Eliminar'}
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-2xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" strokeWidth={1.5} />
            <span className="text-xs text-foreground truncate">{name}</span>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={openEdit}
              aria-label={`Renombrar ${name}`}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setConfirming(true)}
              aria-label={`Eliminar ${name}`}
              className="p-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </li>
  )
}

// ── Add subcategory form ──────────────────────────────────────────────────────

function AddSubcategoryForm({ categoryName }: { categoryName: string }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!value.trim()) {
      setError('Ingresá un nombre.')
      inputRef.current?.focus()
      return
    }
    startTransition(async () => {
      const result = await addSubcategory(categoryName, value)
      if (result?.error) {
        setError(result.error)
        inputRef.current?.focus()
      } else {
        setValue('')
        inputRef.current?.focus()
      }
    })
  }

  return (
    <form onSubmit={handleAdd} className="pl-4 pr-2 pt-2 pb-3 border-t border-border space-y-1">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError('') }}
          placeholder="Nueva subcategoría…"
          maxLength={60}
          autoComplete="off"
          className={cn(
            'flex-1 px-2 py-1.5 border bg-background text-xs focus:outline-none focus:ring-1 rounded-none placeholder:text-muted-foreground',
            error
              ? 'border-primary focus:ring-primary'
              : 'border-border focus:border-primary focus:ring-primary',
          )}
        />
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 text-2xs font-medium tracking-widest uppercase hover:bg-primary-hover transition-colors rounded-none disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
        >
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" strokeWidth={2} />}
          Agregar
        </button>
      </div>
      {error && <p className="text-xs text-primary" role="alert">{error}</p>}
    </form>
  )
}

// ── Category row ──────────────────────────────────────────────────────────────

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
    if (editing) editInputRef.current?.select()
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
    <li className={cn('', !isLast && 'border-b border-border')}>
      {/* Category header */}
      <div className="px-6 py-4">
        {editing ? (
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
              <button
                onClick={openEdit}
                aria-label={`Renombrar ${cat.name}`}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-none"
              >
                <Pencil className="h-4 w-4" strokeWidth={1.5} />
              </button>
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
      </div>

      {/* Subcategories section */}
      <div className="mx-6 mb-4 border border-border bg-surface">
        <p className="px-4 py-2 text-2xs font-medium tracking-widest uppercase text-muted-foreground border-b border-border">
          Subcategorías
        </p>
        {cat.subcategories.length > 0 && (
          <ul>
            {cat.subcategories.map((sub, i) => (
              <SubcategoryRow
                key={sub}
                categoryName={cat.name}
                name={sub}
                isLast={i === cat.subcategories.length - 1}
              />
            ))}
          </ul>
        )}
        {cat.subcategories.length === 0 && (
          <p className="px-4 py-2 text-xs text-muted-foreground/60 italic">
            Sin subcategorías
          </p>
        )}
        <AddSubcategoryForm categoryName={cat.name} />
      </div>
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
        <form onSubmit={handleAdd} className="flex gap-3 items-end">
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
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 text-xs font-medium tracking-widest uppercase hover:bg-primary-hover transition-colors rounded-none disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
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
