import type { ProductModel, CartItemModel } from '../../generated/prisma/models.ts'

export type { ProductModel, CartItemModel }

export type ProductWithCartItems = ProductModel & {
  cartItems?: CartItemModel[]
}

export type CartItemWithProduct = CartItemModel & {
  product: ProductModel
}
