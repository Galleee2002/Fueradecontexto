'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { Plus, Trash2, AlertTriangle, Loader2, Pencil, Check, X, Palette } from 'lucide-react'
import { createColor, updateColor, deleteColor } from '../actions/color-actions'
import { cn } from '@/shared/lib/cn'

interface ColorRow {
  id: string
  name: string
  hex: string
}

// ── Hex input with live swatch preview ──────────────────────────────────────

function HexInput({
  value,
  onChange,
  id,
  className,
}: {
  value: string
  onChange: (v: string) => void
  id?: string
  className?: string
}) {
  return (
    <div className="relative flex items-center">
      <div
        className="absolute left-3 h-4 w-4 shrink-0 border border-border/60"
        style={{ backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#cccccc' }}
        aria-hidden="true"
      />
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        maxLength={7}
        autoComplete="off"
        spellCheck={false}
        className={cn(
          'pl-9 pr-3 py-2.5 border bg-background text-sm font-mono focus:outline-none focus:ring-1 rounded-none w-full uppercase placeholder:normal-case placeholder:font-sans',
          className,
        )}
      />
    </div>
  )
}

// ── Single color row ─────────────────────────────────────────────────────────

function ColorRow({ color, isLast }: { color: ColorRow; isLast: boolean }) {
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(color.name)
  const [editHex, setEditHex] = useState(color.hex)
  const [editError, setEditError] = useState('')
  const [isEditPending, startEdit] = useTransition()

  const [confirming, setConfirming] = useState(false)
  const [isDeletePending, startDelete] = useTransition()

  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) editInputRef.current?.select()
  }, [editing])

  function openEdit() {
    setEditName(color.name)
    setEditHex(color.hex)
    setEditError('')
    setEditing(true)
    setConfirming(false)
  }

  function cancelEdit() {
    setEditing(false)
    setEditError('')
  }

  function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setEditError('')
    startEdit(async () => {
      const result = await updateColor(color.id, editName, editHex)
      if (result?.error) {
        setEditError(result.error)
        editInputRef.current?.focus()
      } else {
        setEditing(false)
      }
    })
  }

  function handleDelete() {
    startDelete(async () => {
      await deleteColor(color.id)
      setConfirming(false)
    })
  }

  return (
    <li className={cn('px-6 py-4', !isLast && 'border-b border-border')}>
      {editing ? (
        <form onSubmit={handleUpdate} className="flex items-start gap-3">
          <div
            className="h-4 w-4 shrink-0 border border-border/60 mt-2.5"
            style={{ backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(editHex) ? editHex : '#cccccc' }}
            aria-hidden="true"
          />
          <div className="flex-1 grid grid-cols-[1fr_auto] gap-2">
            <div className="space-y-1.5">
              <input
                ref={editInputRef}
                type="text"
                value={editName}
                onChange={(e) => { setEditName(e.target.value); setEditError('') }}
                maxLength={60}
                autoComplete="off"
                placeholder="Nombre del color"
                className={cn(
                  'w-full px-2 py-1.5 border bg-background text-sm focus:outline-none focus:ring-1 rounded-none',
                  editError
                    ? 'border-primary focus:ring-primary'
                    : 'border-border focus:border-primary focus:ring-primary',
                )}
              />
              {editError && (
                <p className="text-xs text-primary" role="alert">{editError}</p>
              )}
            </div>
            <div className="relative flex items-center">
              <div
                className="absolute left-2 h-4 w-4 shrink-0 border border-border/60"
                style={{ backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(editHex) ? editHex : '#cccccc' }}
                aria-hidden="true"
              />
              <input
                type="text"
                value={editHex}
                onChange={(e) => { setEditHex(e.target.value.toUpperCase()); setEditError('') }}
                maxLength={7}
                autoComplete="off"
                spellCheck={false}
                placeholder="#000000"
                className="pl-8 pr-2 py-1.5 border border-border bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary rounded-none w-28 uppercase placeholder:normal-case placeholder:font-sans"
              />
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 mt-0.5">
            <button
              type="submit"
              disabled={isEditPending}
              aria-label="Guardar color"
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              {isEditPending
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
            <span className="text-sm font-medium text-foreground">{color.name}</span>
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
            <div
              className="h-4 w-4 shrink-0 border border-border/60"
              style={{ backgroundColor: color.hex }}
              aria-label={color.hex}
            />
            <span className="text-sm font-medium text-foreground truncate">{color.name}</span>
            <span className="text-xs font-mono text-muted-foreground tabular-nums">{color.hex}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={openEdit}
              aria-label={`Editar ${color.name}`}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-none"
            >
              <Pencil className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setConfirming(true)}
              aria-label={`Eliminar ${color.name}`}
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

export function ColorsManager({ colors }: { colors: ColorRow[] }) {
  const [isPending, startTransition] = useTransition()
  const [nameValue, setNameValue] = useState('')
  const [hexValue, setHexValue] = useState('#000000')
  const [formError, setFormError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!nameValue.trim()) {
      setFormError('Ingresá un nombre para el color.')
      inputRef.current?.focus()
      return
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(hexValue)) {
      setFormError('El código HEX debe tener el formato #RRGGBB.')
      return
    }
    startTransition(async () => {
      const result = await createColor(nameValue, hexValue)
      if (result?.error) {
        setFormError(result.error)
        inputRef.current?.focus()
      } else {
        setNameValue('')
        setHexValue('#000000')
        inputRef.current?.focus()
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="bg-background border border-border p-4 sm:p-6">
        <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground border-b border-border pb-3 mb-5">
          Nuevo color
        </p>
        <form
          onSubmit={handleAdd}
          className="flex flex-col gap-3 items-stretch sm:flex-row sm:items-end"
        >
          <div className="min-w-0 flex-1 space-y-1.5">
            <label
              htmlFor="color-name"
              className="block text-2xs font-medium tracking-widest uppercase text-muted-foreground"
            >
              Nombre
            </label>
            <input
              id="color-name"
              ref={inputRef}
              type="text"
              value={nameValue}
              onChange={(e) => { setNameValue(e.target.value); setFormError('') }}
              placeholder="Ej: Negro, Blanco hueso, Rosa chicle"
              maxLength={60}
              autoComplete="off"
              className={cn(
                'w-full px-3 py-2.5 border bg-background text-sm focus:outline-none focus:ring-1 rounded-none placeholder:text-muted-foreground',
                formError
                  ? 'border-primary focus:ring-primary'
                  : 'border-border focus:border-primary focus:ring-primary',
              )}
            />
          </div>
          <div className="min-w-0 space-y-1.5 sm:shrink-0">
            <label
              htmlFor="color-hex"
              className="block text-2xs font-medium tracking-widest uppercase text-muted-foreground"
            >
              Color HEX
            </label>
            <div className="flex w-full min-w-0 items-center gap-2">
              <div className="relative min-w-0 flex-1 sm:w-36 sm:flex-none">
                <HexInput
                  id="color-hex"
                  value={hexValue}
                  onChange={(v) => { setHexValue(v); setFormError('') }}
                  className={
                    formError
                      ? 'border-primary focus:ring-primary'
                      : 'border-border focus:border-primary focus:ring-primary'
                  }
                />
              </div>
              {/* Native color picker as complement */}
              <label
                className="h-[42px] w-[42px] shrink-0 border border-border cursor-pointer overflow-hidden relative hover:border-foreground transition-colors"
                aria-label="Abrir selector de color"
                title="Elegir color"
              >
                <span className="absolute inset-0" style={{ backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(hexValue) ? hexValue : '#cccccc' }} />
                <input
                  type="color"
                  value={/^#[0-9A-Fa-f]{6}$/.test(hexValue) ? hexValue : '#000000'}
                  onChange={(e) => { setHexValue(e.target.value.toUpperCase()); setFormError('') }}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 bg-primary px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary-hover sm:w-auto sm:shrink-0 rounded-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" strokeWidth={2} />}
            Agregar
          </button>
        </form>
        {formError && <p className="text-xs text-primary mt-3" role="alert">{formError}</p>}
      </div>

      {/* Color list */}
      <div className="bg-background border border-border">
        <div className="px-6 py-3 border-b border-border">
          <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground">
            Colores existentes
            <span className="ml-2 font-normal text-foreground">{colors.length}</span>
          </p>
        </div>

        {colors.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
            <Palette className="h-8 w-8 opacity-30" strokeWidth={1} />
            <p className="text-sm">No hay colores todavía.</p>
            <p className="text-xs opacity-70">Agregá uno arriba para empezar.</p>
          </div>
        ) : (
          <ul>
            {colors.map((color, i) => (
              <ColorRow key={color.id} color={color} isLast={i === colors.length - 1} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
