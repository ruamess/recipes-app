import { View } from 'react-native'

import { BottomSheet } from 'components/atoms/bottom-sheet'
import { Text } from 'components/atoms/text'
import dayjs from 'dayjs'
import type { FridgeItem } from 'domain/fridge/item/types'
import { Product } from 'domain/product/item/types'

type Props = {
  item: FridgeItem | null
  product?: Product
  onRemove: () => void
  isVisible: boolean
  onClose: () => void
}

export const FridgeItemDetailsSheet = ({ isVisible, onClose, item, product }: Props) => {
  return (
    <BottomSheet isVisible={isVisible} onClose={onClose} snapPoints={[0.28]}>
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
        <Row label="Category">
          <Text>{product?.category ?? '—'}</Text>
        </Row>
        <Row label="Expire date">
          <Text>{item?.expire ? dayjs(item.expire).format('DD.MM.YYYY') : '—'}</Text>
        </Row>
      </View>
    </BottomSheet>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="w-full flex-row items-center justify-between">
      <Text>{label}</Text>
      <View className="flex-row items-center gap-1">{children}</View>
    </View>
  )
}
