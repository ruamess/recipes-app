import { forwardRef } from 'react'
import { View } from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'
import { Product } from 'domain/product/item/types'
import { MyBottomSheet } from 'components/atoms/bottom-sheet'
import { BottomSheetInput } from 'components/atoms/bottom-sheet-input'
import { Button } from 'components/atoms/button'
import { Text } from 'components/atoms/text'

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
      keyboardBlurBehavior="restore"
    >
      <View className="flex-row items-center justify-center gap-3">
        <Text className="text-lg">{item?.emoji}</Text>
        <Text className="text-lg">{item?.name}</Text>
      </View>

      <View className="w-full gap-5">
        <Row label="Quantity">
          <BottomSheetInput className="w-fit" />
          <Text className="text-sm">{item?.unit}</Text>
        </Row>
        <Row label="Storage">
          <Text>-</Text>
        </Row>
        <Row label="Expire date">
          <Text>-</Text>
        </Row>
      </View>

      <Button className="flex h-12 w-full flex-row items-center justify-center gap-2">
        <Text>Add to fridge</Text>
      </Button>
    </MyBottomSheet>
  )
})

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="w-full flex-row items-center justify-between">
      <Text>{label}</Text>
      <View className="flex-row items-center gap-2">{children}</View>
    </View>
  )
}
