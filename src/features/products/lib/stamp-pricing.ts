export const STAMP_UPCHARGES: Record<string, number> = {
  'Hasta 10 cm': 3000,
  '20x30': 6000,
  '30x40': 9000,
  '40x50': 12000,
}

export function isCapCategory(category: string) {
  return category.toLowerCase().includes('gorra')
}

export function getStampUpcharge(stampSize: string | null, category: string) {
  if (!stampSize || isCapCategory(category)) return 0
  return STAMP_UPCHARGES[stampSize] ?? 0
}

export function getEffectivePrice(basePrice: number, stampSize: string | null, category: string) {
  return basePrice + getStampUpcharge(stampSize, category)
}
