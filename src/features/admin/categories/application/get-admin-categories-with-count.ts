import { findAdminCategoriesWithCount } from '../infrastructure/category-repository'

export async function getAdminCategoriesWithCount() {
  return findAdminCategoriesWithCount()
}
