export const SHIPPING_CORREO_ARGENTINO_ENABLED =
  process.env.SHIPPING_CORREO_ARGENTINO_ENABLED !== 'false'

export const SHIPPING_METHOD_CORREO_ARGENTINO_HOME = 'correo_argentino_home'
export const SHIPPING_METHOD_CORREO_ARGENTINO_BRANCH = 'correo_argentino_branch'
export const SHIPPING_CARRIER_CORREO_ARGENTINO = 'correo_argentino'

export const SHIPPING_METHOD_SELLER_PICKUP = 'seller_pickup'
export const SHIPPING_CARRIER_SELLER = 'seller'

export const ORDER_SHIPPING_STATUSES = [
  'not_imported',
  'import_pending',
  'imported',
  'in_transit',
  'delivered',
  'import_failed',
] as const

export type OrderShippingStatus = (typeof ORDER_SHIPPING_STATUSES)[number]

export const ORDER_SHIPPING_STATUS_LABELS: Record<OrderShippingStatus, string> = {
  not_imported: 'No importado',
  import_pending: 'Importando',
  imported: 'Importado',
  in_transit: 'En tránsito',
  delivered: 'Entregado',
  import_failed: 'Error de importación',
}

export const ORDER_SHIPPING_STATUS_STYLES: Record<OrderShippingStatus, string> = {
  not_imported: 'bg-surface text-muted-foreground border-border',
  import_pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  imported: 'bg-blue-50 text-blue-700 border-blue-200',
  in_transit: 'bg-sky-50 text-sky-700 border-sky-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  import_failed: 'bg-red-50 text-red-700 border-red-200',
}
