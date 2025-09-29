import { forwardRef } from 'react'
import { View } from 'react-native'

import { BottomSheet } from 'components/atoms/my-bottom-sheet'
import { BottomSheetMethods } from 'components/atoms/my-bottom-sheet/types'
import { Text } from 'components/atoms/text'
import dayjs from 'dayjs'
import type { FridgeItem } from 'domain/fridge/item/types'
import { Product } from 'domain/product/item/types'

type Props = {
  item: FridgeItem | null
  product?: Product
  onRemove: () => void
}

export const FridgeItemDetailsSheet = forwardRef<BottomSheetMethods, Props>(
  ({ item, product }, ref) => {
    return (
      <BottomSheet ref={ref} snapTo="40%">
        <View className="flex-row items-center justify-center gap-3">
          <Text className="text-lg">{product?.emoji}</Text>
          <Text className="text-lg">{product?.name}</Text>
        </View>
        <View className="w-full gap-5">
          <Row label="Quantity">
            <Text>
              {item?.quantity ?? '—'} {product?.unit}
            </Text>
          </Row>
          {item?.storage && (
            <Row label="Storage">
              <Text>{item.storage}</Text>
            </Row>
          )}
          <Row label="Category">
            <Text>{product?.category ?? '—'}</Text>
          </Row>
          <Row label="Expire date">
            <Text>{item?.expire ? dayjs(item.expire).format('DD.MM.YYYY') : '—'}</Text>
          </Row>
        </View>
      </BottomSheet>
    )
  },
)

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="w-full flex-row items-center justify-between">
      <Text>{label}</Text>
      <View className="flex-row items-center gap-1">{children}</View>
    </View>
  )
}
