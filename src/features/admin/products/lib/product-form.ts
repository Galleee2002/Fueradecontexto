export const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']
export const STAMP_SIZE_OPTIONS = ['Hasta 10 cm', '20x30', '30x40', '40x50']

export function slugifyProductName(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '')
}
