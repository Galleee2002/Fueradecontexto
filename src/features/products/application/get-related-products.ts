import { findRelatedProducts } from '../infrastructure/product-repository'

export async function getRelatedProducts(category: string, excludeSlug: string, limit = 4) {
  return findRelatedProducts(category, excludeSlug, limit)
}
