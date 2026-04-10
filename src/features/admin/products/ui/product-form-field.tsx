interface ProductFormFieldProps {
  label: string
  error?: string | undefined
  required?: boolean | undefined
  children: React.ReactNode
}

export function ProductFormField({
  label,
  error,
  required,
  children,
}: ProductFormFieldProps) {
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
