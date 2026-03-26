export interface ProductCard {
  id: string
  slug: string
  name: string
  price: number
  imageUrl: string
  category: string
}

export interface ProductFull extends ProductCard {
  description: string | null
  active: boolean
  createdAt: Date
  updatedAt: Date
  availableColors: string[]
  availableSizes: string[]
  stampSizes: string[]
  stampLocations: string[]
}

export interface SizeGuideRow {
  talle: string
  [measurement: string]: string | number
}

export interface SizeGuide {
  id: string
  category: string
  rows: SizeGuideRow[]
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  sort?: 'newest' | 'price-asc' | 'price-desc'
}
