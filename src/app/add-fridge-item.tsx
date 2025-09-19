import type { Product } from 'entities/product/model/types'
import { ProductPicker } from 'widgets/product-picker/ui/product-picker'

export default function Screen() {
  const handlePick = (p: Product) => {
    // TODO: navigation and FridgeItem creation
    console.log('Pick product:', p.id, p.name)
  }

  return <ProductPicker onPick={handlePick} />
}
