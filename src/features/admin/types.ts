import type { ProductColor } from '@/entities/product'
import type { OrderStatus } from '@/shared/config/orders'

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
  imageUrl: string
  previewImages: string[]
  category: string
  subcategory: string
  active: boolean
  createdAt: Date
  updatedAt: Date
  availableColors: ProductColor[]
  availableSizes: string[]
  stampSizes: string[]
  stampLocations: string[]
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
