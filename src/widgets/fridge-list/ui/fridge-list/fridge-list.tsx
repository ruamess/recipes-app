import { TouchableOpacity, View } from 'react-native'

import type { FridgeItem } from 'entities/fridge-item/model/types'
import { Product } from 'entities/product/model/types'
import { Card, CardContent } from 'shared/ui/card'
import { CircularExpiryProgress } from 'shared/ui/circular-expiry-progress'
import { Text } from 'shared/ui/text'

type Props = {
  items: FridgeItem[]
  productsById: Record<number, Product>
  onPress: (it: FridgeItem) => void
}

export function FridgeList({ items, productsById, onPress }: Props) {
  return (
    <View className="w-full gap-2">
      {items.map((it) => {
        const p = productsById[it.productId]
        if (!p) return null
        return (
          <TouchableOpacity key={it.id} activeOpacity={0.6} onPress={() => onPress(it)}>
            <Card className="w-full rounded-2xl py-4">
              <CardContent className="flex-row items-center justify-between px-4">
                <View className="flex-row items-center gap-3">
                  <Text>{p.emoji}</Text>
                  <Text>{p.name}</Text>
                </View>
                <CircularExpiryProgress
                  showDaysLabel={false}
                  expire={it.expire}
                  size={25}
                  strokeWidth={3.5}
                />
              </CardContent>
            </Card>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
