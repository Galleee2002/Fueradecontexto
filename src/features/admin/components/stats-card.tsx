import { cn } from '@/lib/utils/cn'

interface StatsCardProps {
  label: string
  value: number | string
  description?: string
  accent?: boolean
}

export function StatsCard({ label, value, description, accent = false }: StatsCardProps) {
  return (
    <div className="bg-background border border-border p-5">
      <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground mb-3">
        {label}
      </p>
      <p className={cn('text-3xl font-light tabular-nums', accent ? 'text-primary' : 'text-foreground')}>
        {value}
      </p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  )
}
