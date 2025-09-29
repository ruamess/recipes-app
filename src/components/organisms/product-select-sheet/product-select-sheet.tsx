import { forwardRef } from 'react'
import { View } from 'react-native'

import { Button } from 'components/atoms/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from 'components/atoms/dropdown-menu'
import { Input } from 'components/atoms/input'
import { BottomSheet } from 'components/atoms/my-bottom-sheet'
import { BottomSheetMethods } from 'components/atoms/my-bottom-sheet/types'
import { Text } from 'components/atoms/text'
import { Product } from 'domain/product/item/types'

type Props = {
  item: Product | null
  // onChange: (i: number) => void
}

export const ProductSelectSheet = forwardRef<BottomSheetMethods, Props>(({ item }, ref) => {
  return (
    <BottomSheet ref={ref} contentClassName="px-6 pt-4 pb-8 gap-8 bg-blue-500" snapTo="40%">
      <View className="flex-row items-center justify-center gap-3">
        <Text className="text-lg">{item?.emoji}</Text>
        <Text className="text-lg">{item?.name}</Text>
      </View>

      <View className="w-full gap-5">
        <Row label="Quantity">
          <Input className="w-fit" />
          <Text className="text-sm">{item?.unit}</Text>
        </Row>
        <Row label="Storage">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <View className="flex-row items-center gap-2 rounded-full border border-border bg-card px-3 py-2">
                <Text>Select</Text>
              </View>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-1 min-w-[200px] rounded-2xl border border-border bg-popover p-1">
              <DropdownMenuLabel className="px-2 py-1.5 text-xs text-foreground/70">
                Filter by
              </DropdownMenuLabel>
              <DropdownMenuItem className="flex-row items-center justify-between rounded-lg px-2 py-2">
                <View className="flex-row items-center gap-2">
                  <Text>Fridge</Text>
                </View>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Row>
        <Row label="Expire date">
          <Text>-</Text>
        </Row>
      </View>

      <Button className="flex h-12 w-full flex-row items-center justify-center gap-2">
        <Text>Add to fridge</Text>
      </Button>
    </BottomSheet>
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
