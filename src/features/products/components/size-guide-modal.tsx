'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { SizeGuide } from '../types'

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
  category: string
  guide: SizeGuide | null
}

export function SizeGuideModal({ isOpen, onClose, category, guide }: SizeGuideModalProps) {
  useEffect(() => {
    if (!isOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const columns = guide && guide.rows.length > 0
    ? (() => {
        const keys = Object.keys(guide.rows[0]!)
        const talle = keys.filter((k) => k.toLowerCase() === 'talle')
        const rest = keys.filter((k) => k.toLowerCase() !== 'talle')
        return [...talle, ...rest]
      })()
    : []

  return (
    <div
      className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border max-w-lg w-full max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-sm font-medium tracking-widest uppercase">
            Guía de talles — {category}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-5">
          {!guide || guide.rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay guía de talles disponible para esta categoría.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="text-left py-2 pr-4 text-2xs font-medium tracking-widest uppercase text-muted-foreground"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guide.rows.map((row, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      {columns.map((col) => (
                        <td key={col} className="py-2.5 pr-4 text-sm">
                          {row[col] ?? '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
