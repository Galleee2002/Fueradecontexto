import { z } from 'zod'

export const productSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  name: z.string().min(1, 'El nombre es requerido').max(200),
  description: z.string().max(2000).optional(),
  price: z.number().positive('El precio debe ser mayor a 0'),
  imageUrl: z.string().url('URL de imagen inválida'),
  category: z.string().min(1, 'La categoría es requerida'),
  active: z.boolean().default(true),
})

export type ProductInput = z.infer<typeof productSchema>

export const productFiltersSchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().positive().optional(),
  search: z.string().max(100).optional(),
})

export type ProductFiltersInput = z.infer<typeof productFiltersSchema>
