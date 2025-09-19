export interface FridgeItem {
  id: number
  productId: number
  comment?: string

  // 📦 base
  brand?: string
  expire?: string
  quantity?: number
  weight?: number

  // 📊 status
  storage?: 'fridge' | 'freezer' | 'pantry'
  status?: 'fresh' | 'expiring' | 'expired'
}
