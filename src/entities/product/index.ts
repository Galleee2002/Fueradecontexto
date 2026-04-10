export interface ProductColor {
  name: string
  hex: string
}

export interface ProductCard {
  id: string
  slug: string
  name: string
  price: number
  stock: number
  imageUrl: string
  previewImages: string[]
  category: string
}

export interface ProductFull extends ProductCard {
  description: string | null
  active: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  availableColors: ProductColor[]
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
