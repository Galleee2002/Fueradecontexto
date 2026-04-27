import { cn } from '@/shared/lib/cn'

interface StatsCardProps {
  label: string
  value: number | string
  description?: string
  accent?: boolean
}

export function StatsCard({ label, value, description, accent = false }: StatsCardProps) {
  return (
    <div className="admin-panel p-5">
      <p className="mb-3 text-2xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className={cn('text-3xl font-light tabular-nums tracking-[-0.04em]', accent ? 'text-primary' : 'text-foreground')}>
        {value}
      </p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  )
}
