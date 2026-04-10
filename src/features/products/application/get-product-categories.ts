import { findProductCategories } from '../infrastructure/product-repository'

export async function getProductCategories() {
  return findProductCategories()
}
