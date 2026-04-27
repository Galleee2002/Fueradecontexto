interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="brand-panel mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-16 text-center sm:px-10 sm:py-20">
      <p className="brand-kicker">Estado</p>
      <h3 className="mt-3 text-3xl font-medium tracking-[-0.04em] sm:text-4xl">{title}</h3>
      {description && (
        <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">{description}</p>
      )}
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  )
}
