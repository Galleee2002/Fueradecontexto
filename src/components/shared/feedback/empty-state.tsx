interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h3 className="text-2xl font-medium font-serif mb-3">{title}</h3>
      {description && (
        <p className="text-muted-foreground text-base mb-8 max-w-sm">{description}</p>
      )}
      {action}
    </div>
  )
}
