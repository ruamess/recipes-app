import type { Product, ProductCategory } from 'domain/product/item/types'

import { ProductRow } from './types'

export function filterProducts(
  products: Product[],
  query: string,
  category: ProductCategory | 'all',
): Product[] {
  const q = query.trim().toLowerCase()
  return products.filter(
    (p) =>
      (category === 'all' || p.category === category) && (!q || p.name.toLowerCase().includes(q)),
  )
}

export function buildProductRows(filtered: Product[]): ProductRow[] {
  const rows: ProductRow[] = []
  let prevLetter = ''
  for (const p of filtered) {
    const letter = p.name.charAt(0).toUpperCase()
    if (letter !== prevLetter) {
      rows.push({ type: 'header', letter })
      prevLetter = letter
    }
    rows.push({ type: 'product', product: p })
  }
  return rows
}
