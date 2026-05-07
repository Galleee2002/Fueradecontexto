/** Orden de tallas de prenda en tienda y admin (única fuente de verdad). */
export const GARMENT_SIZES_ORDERED = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const

export type GarmentSize = (typeof GARMENT_SIZES_ORDERED)[number]
