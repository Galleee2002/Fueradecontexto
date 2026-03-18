import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
}

export function PageHeader({ title, breadcrumb }: PageHeaderProps) {
  return (
    <div className="py-8 border-b border-border">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="flex items-center gap-2 mb-4 text-xs font-medium tracking-wide uppercase text-muted-foreground">
          {breadcrumb.map((item, index) => (
            <span key={index} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              {item.href ? (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="text-5xl font-normal font-serif">{title}</h1>
    </div>
  )
}
