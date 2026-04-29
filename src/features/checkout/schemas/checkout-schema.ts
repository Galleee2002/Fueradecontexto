import { z } from 'zod'

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(10),
})

export const checkoutCartSchema = z.array(cartItemSchema).min(1)

export const shippingSchema = z.object({
  deliveryType: z.enum(['D', 'S']),
  calle: z.string().trim().min(2, 'Ingresá una calle válida'),
  numero: z
    .string()
    .trim()
    .min(1, 'El número es requerido')
    .refine((value) => /\d/.test(value), 'Ingresá un número válido')
    .refine((value) => /^[0-9A-Za-z/-]+$/.test(value), 'Ingresá un número válido'),
  pisoDpto: z.string(),
  ciudad: z.string().trim().min(2, 'Ingresá una ciudad válida'),
  provincia: z.string().min(1, 'La provincia es requerida'),
  codigoPostal: z
    .string()
    .trim()
    .regex(/^(\d{4}|[A-Za-z]\d{4}[A-Za-z]{0,3})$/, 'Ingresá un código postal válido, por ejemplo 1414 o C1414ABC'),
  agencyCode: z.string().trim(),
  agencyName: z.string().trim(),
}).superRefine((value, ctx) => {
  if (value.deliveryType === 'S' && value.agencyCode.length < 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['agencyCode'],
      message: 'Ingresá un código de sucursal válido.',
    })
  }
  if (value.deliveryType === 'S' && value.agencyName.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['agencyName'],
      message: 'Seleccioná una sucursal de la lista.',
    })
  }
})

export type CheckoutCartItem = z.infer<typeof cartItemSchema>
