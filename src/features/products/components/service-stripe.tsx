import { Truck, RefreshCw, ShieldCheck } from 'lucide-react'

const BADGES = [
  { icon: Truck,       label: 'Envío',          sublabel: 'entre 4 y 7 días hábiles' },
  { icon: RefreshCw,   label: 'Cambios gratis', sublabel: '30 días sin cargo'   },
  { icon: ShieldCheck, label: 'Pago seguro',    sublabel: 'encriptado SSL'      },
] as const

export function ServiceStripe() {
  return (
    <div className="grid grid-cols-3 divide-x divide-border border border-border bg-surface">
      {BADGES.map((badge) => (
        <div key={badge.label} className="flex flex-col items-center gap-2 py-4 px-3 text-center">
          <badge.icon className="h-5 w-5 text-muted-foreground stroke-[1.5]" aria-hidden="true" />
          <div>
            <p className="text-xs font-medium text-foreground leading-snug">{badge.label}</p>
            <p className="text-2xs text-muted-foreground leading-snug">{badge.sublabel}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
