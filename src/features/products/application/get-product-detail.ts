import {
  findProductBySlug,
  findSizeGuideByCategory,
} from '../infrastructure/product-repository'

export async function getProductDetail(slug: string) {
  const product = await findProductBySlug(slug)

  if (!product) {
    return null
  }

  const sizeGuide = await findSizeGuideByCategory(product.category)

  return { product, sizeGuide }
}
