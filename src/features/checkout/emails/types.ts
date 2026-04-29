export interface PaidOrderEmailItem {
  productName: string
  quantity: number
  unitPrice: number
}

export interface PaidOrderEmailPayload {
  orderId: string
  customerEmail: string
  customerName: string
  customerPhone: string
  total: number
  shippingMethod: string | null
  shippingCarrier: string | null
  shippingCost: number | null
  shippingAddress: unknown
  items: PaidOrderEmailItem[]
}
