export interface CartItemUI {
  id: string
  productId: string
  productName: string
  productPrice: number
  productImageUrl: string
  productSlug: string
  quantity: number
  variantKey: string
  selectedColor?: string
  selectedSize?: string
  selectedStampSize?: string
  selectedStampLocation?: string
}

export interface CartState {
  items: CartItemUI[]
  isOpen: boolean
}
