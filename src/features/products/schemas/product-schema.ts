import { z } from 'zod'
import { evaluateProductQuality } from '@/features/admin/lib/product-quality'

const productImageSchema = z.object({
  url: z.string().trim().url('URL de imagen inválida'),
  colorName: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() || undefined : undefined),
    z.string().min(1).optional(),
  ),
})

export const productSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  name: z.string().min(1, 'El nombre es requerido').max(200),
  description: z.string().max(2000).optional(),
  price: z.number().positive('El precio debe ser mayor a 0'),
  stock: z.number().int('El stock debe ser un entero').nonnegative('El stock no puede ser negativo'),
  shippingWeightGrams: z.number().int('El peso debe ser entero').min(1, 'El peso debe ser mayor a 0').max(25000, 'El peso no puede superar 25000 g'),
  shippingHeightCm: z.number().int('El alto debe ser entero').min(1, 'El alto debe ser mayor a 0').max(150, 'El alto no puede superar 150 cm'),
  shippingWidthCm: z.number().int('El ancho debe ser entero').min(1, 'El ancho debe ser mayor a 0').max(150, 'El ancho no puede superar 150 cm'),
  shippingLengthCm: z.number().int('El largo debe ser entero').min(1, 'El largo debe ser mayor a 0').max(150, 'El largo no puede superar 150 cm'),
  imageUrl: z.string().trim().url('URL de imagen inválida').optional(),
  images: z.array(productImageSchema).min(1, 'Subí al menos una imagen del producto'),
  category: z.string().min(1, 'La categoría es requerida'),
  subcategory: z.string().max(60).default(''),
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
}).superRefine((data, ctx) => {
  const allowedColorNames = new Set(data.availableColors.map((color) => color.name.trim().toLowerCase()))

  data.images.forEach((image, index) => {
    if (!image.colorName) return

    if (!allowedColorNames.has(image.colorName.trim().toLowerCase())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['images', index, 'colorName'],
        message: 'La imagen solo puede vincularse a un color seleccionado en el producto.',
      })
    }
  })

  if (data.active) {
    const quality = evaluateProductQuality({
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      shippingWeightGrams: data.shippingWeightGrams,
      shippingHeightCm: data.shippingHeightCm,
      shippingWidthCm: data.shippingWidthCm,
      shippingLengthCm: data.shippingLengthCm,
      images: data.images,
      category: data.category,
      active: data.active,
    })

    quality.blockers.forEach((message) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['active'],
        message,
      })
    })
  }
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
