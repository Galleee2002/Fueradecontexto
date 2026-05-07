import { Truck, RefreshCw, ShieldCheck } from 'lucide-react'

const BADGES = [
  { icon: Truck, label: 'Envío', sublabel: 'entre 4 y 7 días hábiles' },
  { icon: RefreshCw, label: 'Cambios gratis', sublabel: '30 días sin cargo' },
  { icon: ShieldCheck, label: 'Pago seguro', sublabel: 'encriptado SSL' },
] as const

export function PurchaseTrustBadges() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface sm:rounded-[1.1rem]">
      <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {BADGES.map((badge) => (
          <div
            key={badge.label}
            className="flex flex-row items-start gap-3 px-4 py-3.5 sm:flex-col sm:items-center sm:gap-2 sm:px-3 sm:py-4 sm:text-center"
          >
            <badge.icon
              className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground stroke-[1.5] sm:mt-0 sm:h-5 sm:w-5"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1 space-y-1 sm:flex-none">
              <p className="text-xs font-medium leading-snug text-foreground">{badge.label}</p>
              <p className="text-xs font-normal leading-snug text-muted-foreground">{badge.sublabel}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
