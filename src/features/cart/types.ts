export interface CartItemUI {
  id: string
  productId: string
  productName: string
  productPrice: number
  productImageUrl: string
  productSlug: string
  quantity: number
}

export interface CartState {
  items: CartItemUI[]
  isOpen: boolean
}
