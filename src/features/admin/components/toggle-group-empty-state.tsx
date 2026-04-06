'use client'

interface ToggleGroupEmptyStateProps {
  label: string
}

export function ToggleGroupEmptyState({ label }: ToggleGroupEmptyStateProps) {
  return (
    <div className="flex items-center justify-center rounded-md border border-dashed border-border bg-surface/40 px-4 py-6">
      <p className="text-sm text-muted-foreground text-center">
        Ningún {label.toLowerCase()} seleccionado
      </p>
    </div>
  )
}
