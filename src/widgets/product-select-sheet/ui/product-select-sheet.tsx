import { forwardRef } from 'react'
import { View } from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'
import { Product } from 'entities/product/model/types'
import { MyBottomSheet } from 'shared/ui/bottom-sheet'
import { Button } from 'shared/ui/button'
import { Text } from 'shared/ui/text'

type Props = {
  item: Product | null
  onChange: (i: number) => void
}

export const ProductSelectSheet = forwardRef<BottomSheet, Props>(({ item, onChange }, ref) => {
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
        <Text className="text-lg">{item?.emoji}</Text>
        <Text className="text-lg">{item?.name}</Text>
      </View>

      <View className="w-full gap-5">
        <Row label="Quantity">
          <Text>-</Text>
        </Row>
        <Row label="Storage">
          <Text>-</Text>
        </Row>
        <Row label="Expire date">
          <Text>-</Text>
        </Row>
      </View>

      <View className="w-full gap-2">
        <Button className="flex h-12 w-full flex-row items-center justify-center gap-2">
          <Text>Add to fridge</Text>
        </Button>
        <Button
          variant="secondary"
          className="flex h-12 w-full flex-row items-center justify-center gap-2"
        >
          <Text>Add to cart</Text>
        </Button>
      </View>
    </MyBottomSheet>
  )
})

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="w-full flex-row items-center justify-between">
      <Text>{label}</Text>
      <View className="flex-row items-center gap-1">{children}</View>
    </View>
  )
}
