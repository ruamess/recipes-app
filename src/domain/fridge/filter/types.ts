export type FridgeFilter = 'all' | 'expiringSoon' | 'expired' | 'fresh' | 'lowQty'

export const FRIDGE_FILTER_LABEL: Record<FridgeFilter, string> = {
  all: 'All items',
  expiringSoon: 'Expiring soon',
  expired: 'Expired',
  fresh: 'Fresh',
  lowQty: 'Low qty',
}
