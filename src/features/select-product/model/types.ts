import type { Product, ProductCategory } from 'entities/product/model/types'

export type ProductRow = { type: 'header'; letter: string } | { type: 'product'; product: Product }

export interface ProductFilterState {
  query: string
  category: ProductCategory | 'all'
}

export const defaultProductFilterState: ProductFilterState = {
  query: '',
  category: 'all',
}
