import type { ProductColor } from '@/features/products/types'

export interface AdminProduct {
  id: string
  slug: string
  name: string
  description: string | null
  price: number
  imageUrl: string
  previewImages: string[]
  category: string
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
  status: string
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
