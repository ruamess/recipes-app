import { useMemo, useRef, useState } from 'react'
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { CATEGORY_LABELS, type Product, type ProductCategory } from 'entities/product/model/types'
import { products } from 'shared/data/products'
import { Badge } from 'shared/ui/badge'
import { Button } from 'shared/ui/button'
import { Card } from 'shared/ui/card'
import { Input } from 'shared/ui/input'
import { Text } from 'shared/ui/text'

export default function Screen() {
  const insets = useSafeAreaInsets()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ProductCategory | 'all'>('all')

  const allCategories = useMemo<ProductCategory[]>(
    () =>
      Array.from(new Set(products.map((p) => p.category))).sort((a, b) =>
        CATEGORY_LABELS[a].localeCompare(CATEGORY_LABELS[b]),
      ),
    [],
  )

  const data = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products
      .filter(
        (p) =>
          (category === 'all' || p.category === category) &&
          (!q || p.name.toLowerCase().includes(q)),
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [query, category])

  const listRef = useRef<FlatList<Product>>(null)

  const handlePickProduct = (p: Product) => {
    // TODO: add FridgeItem logic
    console.log('Pick product:', p.id, p.name)
  }

  return (
    <View style={{ paddingTop: insets.top + 20 }} className="flex-1 gap-4 bg-background px-5">
      <Input
        className="!h-12 w-full px-5"
        value={query}
        onChangeText={setQuery}
        placeholder="Search products..."
      />

      <View className="h-10">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 2,
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Chip label="All" active={category === 'all'} onPress={() => setCategory('all')} />
          {allCategories.map((c) => (
            <Chip
              key={c}
              label={CATEGORY_LABELS[c]}
              active={category === c}
              onPress={() => setCategory(c)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Продукты (FlatList) */}
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 12 }}
        renderItem={({ item, index }) => {
          const cur = item.name.charAt(0).toUpperCase()
          const prev = data[index - 1]?.name.charAt(0).toUpperCase()
          const showHeader = index === 0 || cur !== prev
          return (
            <View>
              {showHeader && (
                <View className="bg-background px-1 py-1">
                  <Text className="text-xs font-medium text-muted-foreground">{cur}</Text>
                </View>
              )}
              <TouchableOpacity activeOpacity={0.7} onPress={() => handlePickProduct(item)}>
                <Card className="mb-2 w-full rounded-xl border border-border/60 bg-card px-3 py-3">
                  <View className="w-full flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View className="h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Text className="text-lg">{item.emoji}</Text>
                      </View>
                      <View>
                        <Text className="text-base">{item.name}</Text>
                        <Text className="text-xs capitalize text-muted-foreground">
                          {CATEGORY_LABELS[item.category]}
                        </Text>
                      </View>
                    </View>
                    <Badge variant="secondary">
                      <Text>{item.unit}</Text>
                    </Badge>
                  </View>
                </Card>
              </TouchableOpacity>
            </View>
          )
        }}
        ListEmptyComponent={
          <Text className="mt-12 text-center text-muted-foreground">Nothing found</Text>
        }
      />
    </View>
  )
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string
  active?: boolean
  onPress?: () => void
}) {
  return (
    <Button variant={active ? 'default' : 'outline'} onPress={onPress}>
      <Text numberOfLines={1}>{label}</Text>
    </Button>
  )
}
