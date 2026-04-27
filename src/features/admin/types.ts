import type { ProductColor, ProductImage } from '@/entities/product'
import type { OrderStatus } from '@/shared/config/orders'
import type { ProductQualityReport } from './lib/product-quality'

export interface CategoryWithSubs {
  name: string
  subcategories: string[]
}

export interface AdminProduct {
  id: string
  slug: string
  name: string
  description: string | null
  price: number
  stock: number
  shippingWeightGrams: number | null
  shippingHeightCm: number | null
  shippingWidthCm: number | null
  shippingLengthCm: number | null
  imageUrl: string
  images: ProductImage[]
  category: string
  subcategory: string
  active: boolean
  createdAt: Date
  updatedAt: Date
  availableColors: ProductColor[]
  availableSizes: string[]
  stampSizes: string[]
  stampLocations: string[]
  quality: ProductQualityReport
}

export interface AdminStats {
  totalProducts: number
  activeProducts: number
  inactiveProducts: number
  totalCategories: number
}

export type AdminProductStatus = 'all' | 'active' | 'inactive'

export interface AdminOrder {
  id: string
  customerEmail: string
  customerName: string
  total: number
  status: OrderStatus
  shippingCarrier: string | null
  shippingCost: number | null
  shippingStatus: string
  trackingNumber: string | null
  shippingMethodLabel: string
  shippingLastEvent: string | null
  createdAt: Date
  itemCount: number
}

export interface AdminClient {
  customerEmail: string
  customerName: string
  totalOrders: number
  totalSpent: number
  lastOrderAt: Date
}
