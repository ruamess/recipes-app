import { Plus } from 'lucide-react-native'
import { useCallback, useMemo, useRef, useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRouter } from 'expo-router'

import BottomSheet from '@gorhom/bottom-sheet'
import type { FridgeItem } from 'entities/fridge-item/model/types'
import { Product } from 'entities/product/model/types'
import { applyFridgeFilter, sortFridgeItems } from 'features/filter-fridge-items/model/selectors'
import type { FridgeFilter } from 'features/filter-fridge-items/model/types'
import { fridgeItems } from 'shared/data/fridgeItems'
import { products } from 'shared/data/products'
import { Button } from 'shared/ui/button'
import { Icon } from 'shared/ui/icon'
import { FridgeHeader } from 'widgets/fridge-header/ui'
import { FridgeItemDetailsSheet } from 'widgets/fridge-item-details-sheet/ui'
import { FridgeList } from 'widgets/fridge-list/ui/fridge-list'

export default function Screen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const sheetRef = useRef<BottomSheet>(null)
  const [filter, setFilter] = useState<FridgeFilter>('all')
  const [selected, setSelected] = useState<FridgeItem | null>(null)

  const productsById = useMemo(() => {
    const map: Record<number, Product> = {}
    for (const p of products) map[p.id] = p
    return map
  }, [])

  const items = useMemo(() => {
    const base = applyFridgeFilter(fridgeItems, filter)
    return sortFridgeItems(base)
  }, [filter])

  const openDetails = (it: FridgeItem) => {
    setSelected(it)
    sheetRef.current?.expand()
  }

  const onSheetChange = useCallback((i: number) => {
    if (i < 0) setSelected(null)
  }, [])

  const removeItem = () => {
    // TODO: feature remove-fridge-item
    sheetRef.current?.close()
  }

  return (
    <View style={{ paddingTop: insets.top + 20 }} className="flex-1 gap-6 bg-background px-4 pb-4">
      <FridgeHeader filter={filter} onChange={setFilter} />

      <FridgeList items={items} productsById={productsById} onPress={openDetails} />

      <Button
        className="absolute bottom-7 right-4 h-16 w-16 rounded-full"
        onPress={() => router.push('/add-fridge-item')}
      >
        <Icon as={Plus} size={23} className="text-background" />
      </Button>

      <FridgeItemDetailsSheet
        ref={sheetRef}
        item={selected}
        product={selected ? productsById[selected.productId] : undefined}
        onRemove={removeItem}
        onChange={onSheetChange}
      />
    </View>
  )
}
