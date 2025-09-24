import { FridgeItem } from 'domain/fridge/item/types'

export const fridgeItems: FridgeItem[] = [
  { id: 1, productId: 24, quantity: 200, storage: 'fridge', expire: '2025-09-21' },
  { id: 2, productId: 20, quantity: 200, storage: 'freezer', expire: '2025-10-30' },
  { id: 3, productId: 1, quantity: 4, storage: 'fridge', expire: '2025-09-19' },
  { id: 4, productId: 43, quantity: 2, storage: 'fridge', expire: '2025-09-25' },
]
