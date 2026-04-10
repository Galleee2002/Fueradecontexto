'use server'

import { revalidatePath } from 'next/cache'
import { sql } from '@/shared/infrastructure/db/client'

export async function addToCart(productId: string, quantity: number, sessionId: string) {
  await sql`
    INSERT INTO "CartItem" ("productId", quantity, "sessionId")
    VALUES (${productId}, ${quantity}, ${sessionId})
    ON CONFLICT ("productId", "sessionId") DO UPDATE
    SET quantity = "CartItem".quantity + ${quantity}
  `
  revalidatePath('/carrito')
}

export async function removeFromCart(cartItemId: string) {
  await sql`DELETE FROM "CartItem" WHERE id = ${cartItemId}`
  revalidatePath('/carrito')
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  if (quantity <= 0) {
    await sql`DELETE FROM "CartItem" WHERE id = ${cartItemId}`
  } else {
    await sql`UPDATE "CartItem" SET quantity = ${quantity} WHERE id = ${cartItemId}`
  }
  revalidatePath('/carrito')
}
