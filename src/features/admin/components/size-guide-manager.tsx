'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, Loader2, Ruler, PackageX } from 'lucide-react'
import { upsertSizeGuide, deleteSizeGuide } from '../actions/size-guide-actions'
import type { SizeGuide, SizeGuideRow } from '@/entities/product'

interface SizeGuideManagerProps {
  guides: SizeGuide[]
  categories: string[]
}

function FormField({
  label,
  error,
  required,
  children,
}: {
  label: string
  error?: string | undefined
  required?: boolean | undefined
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-2xs font-medium tracking-widest uppercase text-muted-foreground">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-primary">{error}</p>}
    </div>
  )
}

export function SizeGuideManager({ guides, categories }: SizeGuideManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [columns, setColumns] = useState<string[]>(['talle', 'pecho', 'largo'])
  const [rows, setRows] = useState<SizeGuideRow[]>([{ talle: '', pecho: '', largo: '' }])
  const [newCol, setNewCol] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null)
  const [isDeletePending, startDelete] = useTransition()

  function handleColumnAdd() {
    const col = newCol.trim().toLowerCase()
    if (!col || columns.includes(col)) return
    setColumns([...columns, col])
    setRows(rows.map((r) => ({ ...r, [col]: '' })))
    setNewCol('')
  }

  function handleColumnRemove(col: string) {
    if (col === 'talle') return
    setColumns(columns.filter((c) => c !== col))
    setRows(rows.map((r) => {
      const next = { ...r }
      delete next[col]
      return next
    }))
  }

  function handleRowChange(rowIndex: number, col: string, value: string) {
    setRows(rows.map((r, i) => i === rowIndex ? { ...r, [col]: value } : r))
  }

  function handleRowAdd() {
    const empty: SizeGuideRow = { talle: '' }
    columns.forEach((c) => { if (c !== 'talle') empty[c] = '' })
    setRows([...rows, empty])
  }

  function handleRowRemove(i: number) {
    setRows(rows.filter((_, idx) => idx !== i))
  }

  function loadGuide(guide: SizeGuide) {
    const cols = guide.rows.length > 0 ? Object.keys(guide.rows[0]!) : ['talle']
    setSelectedCategory(guide.category)
    setColumns(cols)
    setRows(guide.rows)
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!selectedCategory) { setError('Seleccioná una categoría'); return }
    if (rows.length === 0) { setError('Agregá al menos una fila'); return }

    startTransition(async () => {
      const processedRows = rows.map((row) => {
        const result: SizeGuideRow = { talle: row.talle }
        for (const col of columns) {
          if (col !== 'talle') {
            const val = row[col]
            result[col] = val === '' || val === undefined ? 0 : Number(val)
          }
        }
        return result
      })
      const res = await upsertSizeGuide({ category: selectedCategory, rows: processedRows })
      if (res?.error) {
        setError('Error al guardar')
      }
    })
  }

  function handleDelete(category: string) {
    startDelete(async () => {
      await deleteSizeGuide(category)
      setDeletingCategory(null)
    })
  }

  return (
    <div className="space-y-8">
      {/* Editor */}
      <form onSubmit={handleSave} className="bg-background border border-border p-6 space-y-6">
        <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground border-b border-border pb-3">
          Crear / editar guía
        </p>

        {error && (
          <p className="text-xs text-primary">{error}</p>
        )}

        <FormField label="Categoría" required error={undefined}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full max-w-xs px-3 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-none"
          >
            <option value="">Seleccionar...</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </FormField>

        {/* Columns */}
        <div className="space-y-3">
          <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground">
            Columnas
          </p>
          <div className="flex flex-wrap gap-2">
            {columns.map((col) => (
              <span key={col} className="flex items-center gap-1.5 border border-border px-2 py-1 text-xs">
                {col}
                {col !== 'talle' && (
                  <button
                    type="button"
                    onClick={() => handleColumnRemove(col)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`Eliminar columna ${col}`}
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCol}
              onChange={(e) => setNewCol(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleColumnAdd() } }}
              placeholder="Nueva columna"
              className="px-3 py-2.5 border border-border bg-background text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-none w-40 placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={handleColumnAdd}
              className="px-3 py-2.5 border border-border text-xs font-medium tracking-widest uppercase hover:bg-surface transition-colors flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              Agregar
            </button>
          </div>
        </div>

        {/* Table rows */}
        <div className="space-y-3 overflow-x-auto">
          <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground">
            Filas
          </p>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col} className="text-left py-2.5 pr-3 text-2xs font-medium tracking-widest uppercase text-muted-foreground border-b border-border">
                    {col}
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t border-border">
                  {columns.map((col) => (
                    <td key={col} className="py-2.5 pr-2">
                      <input
                        type="text"
                        inputMode={col === 'talle' ? 'text' : 'decimal'}
                        value={row[col] ?? ''}
                        onChange={(e) => handleRowChange(i, col, e.target.value)}
                        className="w-full px-3 py-2.5 border border-border bg-background text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-none"
                      />
                    </td>
                  ))}
                  <td className="py-2.5 pl-1">
                    <button
                      type="button"
                      onClick={() => handleRowRemove(i)}
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Eliminar fila"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={handleRowAdd}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Agregar fila
          </button>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 text-xs font-medium tracking-widest uppercase hover:bg-primary-hover transition-colors rounded-none disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Guardar guía
        </button>
      </form>

      {/* Existing guides */}
      <div className="bg-background border border-border">
        <div className="px-6 py-3 border-b border-border">
          <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground">
            Guías existentes
            <span className="ml-2 font-normal text-foreground">{guides.length}</span>
          </p>
        </div>

        {guides.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
            <PackageX className="h-8 w-8 opacity-30" strokeWidth={1} />
            <p className="text-sm">No hay guías todavía.</p>
          </div>
        ) : (
          <ul>
            {guides.map((guide, i) => (
              <li
                key={guide.id}
                className={`flex items-center justify-between px-6 py-4 ${i < guides.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Ruler className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
                  <div>
                    <span className="text-sm font-medium">{guide.category}</span>
                    <p className="text-xs text-muted-foreground">{guide.rows.length} filas</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadGuide(guide)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                  >
                    Editar
                  </button>
                  {deletingCategory === guide.category ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(guide.category)}
                        disabled={isDeletePending}
                        className="text-xs font-medium text-primary-foreground bg-foreground px-2.5 py-1 hover:bg-primary transition-colors disabled:opacity-50"
                      >
                        {isDeletePending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Eliminar'}
                      </button>
                      <button
                        onClick={() => setDeletingCategory(null)}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingCategory(guide.category)}
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`Eliminar guía ${guide.category}`}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
