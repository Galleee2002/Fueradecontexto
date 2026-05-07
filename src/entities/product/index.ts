export interface ProductColor {
  name: string
  hex: string
}

export interface ProductImage {
  url: string
  colorName?: string | null | undefined
}

export interface ProductCard {
  id: string
  slug: string
  name: string
  description: string | null
  price: number
  stock: number
  imageUrl: string
  images: ProductImage[]
  category: string
}

export interface ProductFull extends ProductCard {
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
