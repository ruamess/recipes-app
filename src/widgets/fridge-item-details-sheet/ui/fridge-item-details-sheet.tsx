import { forwardRef } from 'react'
import { View } from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'
import dayjs from 'dayjs'
import type { FridgeItem } from 'entities/fridge-item/model/types'
import { Product } from 'entities/product/model/types'
import { MyBottomSheet } from 'shared/ui/bottom-sheet'
import { Button } from 'shared/ui/button'
import { Text } from 'shared/ui/text'

type Props = {
  item: FridgeItem | null
  product?: Product
  onRemove: () => void
  onChange: (i: number) => void
}

export const FridgeItemDetailsSheet = forwardRef<BottomSheet, Props>(
  ({ item, product, onChange }, ref) => {
    return (
      <MyBottomSheet
        ref={ref}
        index={-1}
        onChange={onChange}
        backgroundStyle="bg-background rounded-t-3xl"
        indicatorStyle="bg-foreground/20"
        contentClassName="px-6 pt-4 pb-8 gap-8"
      >
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
          <Row label="Expire date">
            <Text>{item?.expire ? dayjs(item.expire).format('DD.MM.YYYY') : '—'}</Text>
          </Row>
          {item?.brand && (
            <Row label="Brand">
              <Text>{item.brand}</Text>
            </Row>
          )}
        </View>
        <Button className="flex h-12 w-full flex-row items-center justify-center gap-2">
          <Text>Close</Text>
        </Button>
      </MyBottomSheet>
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
