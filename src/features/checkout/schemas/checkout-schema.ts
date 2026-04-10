import { z } from 'zod'

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(10),
})

export const checkoutCartSchema = z.array(cartItemSchema).min(1)

export type CheckoutCartItem = z.infer<typeof cartItemSchema>
