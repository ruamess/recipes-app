import type { FridgeItem } from 'entities/fridge-item/model/types'
import { diffDaysFromNow } from 'entities/product/model/expiry'

import type { FridgeFilter } from './types'

export function applyFridgeFilter(items: FridgeItem[], filter: FridgeFilter) {
  return items.filter((it) => {
    const daysLeft = diffDaysFromNow(it.expire)
    switch (filter) {
      case 'expiringSoon':
        return daysLeft !== undefined && daysLeft >= 0 && daysLeft <= 3
      case 'expired':
        return daysLeft !== undefined && daysLeft < 0
      case 'fresh':
        return daysLeft === undefined || daysLeft > 3
      case 'lowQty':
        return (it.quantity ?? 0) <= 1
      default:
        return true
    }
  })
}

export function sortFridgeItems(items: FridgeItem[]) {
  return [...items].sort((a, b) => {
    const da = diffDaysFromNow(a.expire)
    const db = diffDaysFromNow(b.expire)
    const rank = (d?: number) => (d == null ? 9999 : d)
    // expired first
    if ((da ?? 9999) < 0 && (db ?? 9999) >= 0) return -1
    if ((db ?? 9999) < 0 && (da ?? 9999) >= 0) return 1
    if ((da ?? 9999) < 0 && (db ?? 9999) < 0) return (da ?? 0) - (db ?? 0)
    if (rank(da) !== rank(db)) return rank(da) - rank(db)
    return 0
  })
}
