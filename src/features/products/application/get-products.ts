import { findProducts } from '../infrastructure/product-repository'
import type { ProductFilters } from '../types'

export async function getProducts(filters?: ProductFilters, page?: number, limit?: number) {
  return findProducts(filters, page, limit)
}
