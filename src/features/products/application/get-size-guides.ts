import { findSizeGuideByCategory, findSizeGuides } from '../infrastructure/product-repository'

export async function getSizeGuideByCategory(category: string) {
  return findSizeGuideByCategory(category)
}

export async function getSizeGuides() {
  return findSizeGuides()
}
