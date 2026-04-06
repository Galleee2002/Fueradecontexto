import { z } from 'zod'

export const productSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  name: z.string().min(1, 'El nombre es requerido').max(200),
  description: z.string().max(2000).optional(),
  price: z.number().positive('El precio debe ser mayor a 0'),
  imageUrl: z.string().trim().url('URL de imagen inválida'),
  previewImages: z.array(z.string().trim().url('URL de preview inválida')).max(3, 'Máximo 3 imágenes preview').default([]),
  category: z.string().min(1, 'La categoría es requerida'),
  active: z.boolean().default(true),
  availableColors: z.array(
    z.object({
      name: z.string().min(1),
      hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Formato de color inválido'),
    })
  ).default([]),
  availableSizes: z.array(z.string()).default([]),
  stampSizes: z.array(z.string()).default([]),
  stampLocations: z.array(z.string()).default([]),
})

export type ProductInput = z.infer<typeof productSchema>

export const sizeGuideSchema = z.object({
  category: z.string().min(1, 'La categoría es requerida'),
  rows: z.array(
    z.object({ talle: z.string().min(1, 'El talle es requerido') })
      .catchall(z.union([z.number(), z.string()]))
  ).min(1, 'Debe tener al menos una fila'),
})

export type SizeGuideInput = z.infer<typeof sizeGuideSchema>

export const productFiltersSchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().positive().optional(),
  search: z.string().max(100).optional(),
})

export type ProductFiltersInput = z.infer<typeof productFiltersSchema>
