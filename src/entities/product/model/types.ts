export type Unit = 'pcs' | 'g' | 'kg' | 'ml' | 'l'

export interface Product {
  id: number
  emoji: string
  name: string
  unit: Unit
  category: ProductCategory
}

export type ProductCategory =
  | 'meat'
  | 'fish'
  | 'dairy'
  | 'vegetables'
  | 'fruits'
  | 'grains'
  | 'bakery'
  | 'spices'
  | 'sauces'
  | 'snacks'
  | 'drinks'
  | 'sweets'
  | 'frozen'
  | 'other'

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  meat: 'Meat',
  fish: 'Fish',
  dairy: 'Dairy',
  vegetables: 'Vegetables',
  fruits: 'Fruits',
  grains: 'Grains',
  bakery: 'Bakery',
  spices: 'Spices',
  sauces: 'Sauces',
  snacks: 'Snacks',
  drinks: 'Drinks',
  sweets: 'Sweets',
  frozen: 'Frozen',
  other: 'Other',
}
