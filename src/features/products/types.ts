export type {
  ProductCard,
  ProductColor,
  ProductFull,
  SizeGuide,
  SizeGuideRow,
} from '@/entities/product'

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  sort?: 'newest' | 'price-asc' | 'price-desc'
}
