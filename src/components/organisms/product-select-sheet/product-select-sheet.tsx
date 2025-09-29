import React, { useEffect, useState } from 'react'
import { View } from 'react-native'

import { BottomSheet } from 'components/atoms/bottom-sheet'
import { Button } from 'components/atoms/button'
import { DatePicker } from 'components/atoms/date-picker'
import { Input } from 'components/atoms/input'
import { Text } from 'components/atoms/text'
import { Product } from 'domain/product/item/types'

type Props = {
  item: Product | null
  isVisible: boolean
  onClose: () => void
}

export const ProductSelectSheet = ({ isVisible, onClose, item }: Props) => {
  const [expireAt, setExpireAt] = useState<Date | undefined>(undefined)
  const [quantity, setQuantity] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (!isVisible) {
      setExpireAt(undefined)
      setQuantity(undefined)
    }
  }, [isVisible])

  console.log('render ProductSelectSheet', { item })
  console.log('render ProductSelectSheet', { expireAt, quantity })

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose} snapPoints={[0.36]}>
      <View className="h-full w-full gap-5">
        <View className="flex-row items-center justify-center gap-3">
          <Text className="text-lg">{item?.emoji}</Text>
          <Text className="text-lg">{item?.name}</Text>
        </View>

        <View className="w-full gap-5">
          <Row label="Quantity">
            <Input
              className="w-fit !bg-transparent"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
            <Text className="text-sm">{item?.unit}</Text>
          </Row>

          <Row label="Expire date">
            <DatePicker
              mode="date"
              value={expireAt}
              onChange={setExpireAt}
              minimumDate={new Date()}
              variant="outline"
              triggerClassName="w-36"
            />
          </Row>
        </View>

        <Button className="mt-5 flex h-12 w-full flex-row items-center justify-center gap-2">
          <Text>Add to fridge</Text>
        </Button>
      </View>
    </BottomSheet>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="w-full flex-row items-center justify-between">
      <Text>{label}</Text>
      <View className="flex-row items-center gap-2">{children}</View>
    </View>
  )
}
