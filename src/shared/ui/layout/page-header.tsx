import React from 'react'
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  right?: React.ReactNode
}

export function PageHeader({ title, breadcrumb, right }: PageHeaderProps) {
  return (
    <header className="brand-page pb-8">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {breadcrumb.map((item, index) => (
            <span key={index} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {item.href ? (
                <Link href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="brand-panel px-6 py-7 sm:px-8 sm:py-8 lg:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="brand-kicker">Fueradecontexto</p>
            <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.05em] sm:text-5xl lg:text-[3.6rem]">
              {title}
            </h1>
          </div>
          {right ? (
            <div className="w-full min-w-0 lg:max-w-sm lg:shrink-0">{right}</div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
