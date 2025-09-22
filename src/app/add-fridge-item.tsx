/* eslint-disable react-native/no-inline-styles */
import { ArrowLeft } from 'lucide-react-native'
import { useCallback, useMemo, useRef, useState } from 'react'
import { KeyboardAvoidingView, ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRouter } from 'expo-router'

import BottomSheet from '@gorhom/bottom-sheet'
import { AnimatedFlashList } from '@shopify/flash-list'
import { CATEGORY_LABELS, type Product, type ProductCategory } from 'entities/product/model/types'
import { buildProductRows, filterProducts } from 'features/select-product/model/buildRows'
import type { ProductRow } from 'features/select-product/model/types'
import { CategoryChip } from 'features/select-product/ui/category-chip'
import { products } from 'shared/data/products'
import { useDebouncedValue } from 'shared/lib/useDebouncedValue'
import { Badge } from 'shared/ui/badge'
import { Button } from 'shared/ui/button'
import { Card } from 'shared/ui/card'
import { Icon } from 'shared/ui/icon'
import { Input } from 'shared/ui/input'
import { Text } from 'shared/ui/text'
import { ProductSelectSheet } from 'widgets/product-select-sheet/ui'

export default function ProductPicker() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const sheetRef = useRef<BottomSheet>(null)
  const [selected, setSelected] = useState<Product | null>(null)

  const onSheetChange = useCallback((i: number) => {
    if (i < 0) setSelected(null)
  }, [])

  const [category, setCategory] = useState<ProductCategory | 'all'>('all')
  const [queryInput, setQueryInput] = useState('')
  const query = useDebouncedValue(queryInput, 250)

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  )

  const filtered = useMemo(
    () => filterProducts(sortedProducts, query, category),
    [sortedProducts, query, category],
  )

  const rows = useMemo(() => buildProductRows(filtered), [filtered])

  const allCategories = useMemo<ProductCategory[]>(
    () =>
      Array.from(new Set(products.map((p) => p.category))).sort((a, b) =>
        CATEGORY_LABELS[a].localeCompare(CATEGORY_LABELS[b]),
      ),
    [],
  )

  const handlePick = useCallback((p: Product) => {
    setSelected(p)
    sheetRef.current?.expand()
    console.log('Pick product:', p.id, p.name)
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: ProductRow }) => {
      if (item.type === 'header') {
        return (
          <View className="bg-background px-1 py-1">
            <Text className="text-xs font-medium text-muted-foreground">{item.letter}</Text>
          </View>
        )
      }
      const p = item.product
      return (
        <TouchableOpacity activeOpacity={0.7} onPress={() => handlePick(p)}>
          <Card className="mb-2 w-full rounded-xl border border-border/60 bg-card px-3 py-3">
            <View className="w-full flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Text className="text-lg">{p.emoji}</Text>
                </View>
                <View>
                  <Text className="text-base">{p.name}</Text>
                  <Text className="text-xs capitalize text-muted-foreground">
                    {CATEGORY_LABELS[p.category]}
                  </Text>
                </View>
              </View>
              <Badge variant="secondary">
                <Text>{p.unit}</Text>
              </Badge>
            </View>
          </Card>
        </TouchableOpacity>
      )
    },
    [handlePick],
  )

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, paddingTop: insets.top + 20 }}
      className="flex-1 gap-4 bg-background px-4"
      behavior={'padding'}
    >
      <View className="flex-row items-center justify-between gap-2">
        <Button variant="ghost" className="w-10" onPress={() => router.back()}>
          <Icon as={ArrowLeft} size={21} className="text-foreground" />
        </Button>
        <Input
          className="!h-12 flex-1 px-5"
          value={queryInput}
          onChangeText={setQueryInput}
          placeholder="Search products..."
        />
      </View>

      <ScrollView
        className="max-h-12 py-1"
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 2,
          alignItems: 'center',
          gap: 8,
        }}
      >
        <CategoryChip label="All" active={category === 'all'} onPress={() => setCategory('all')} />
        {allCategories.map((c) => (
          <CategoryChip
            key={c}
            label={CATEGORY_LABELS[c]}
            active={category === c}
            onPress={() => setCategory(c)}
          />
        ))}
      </ScrollView>

      <AnimatedFlashList
        data={rows}
        keyExtractor={(item, i) =>
          item.type === 'header' ? `h-${item.letter}-${i}` : `p-${item.product.id}`
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 12 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-10">
            <Text className="text-center text-muted-foreground">Nothing found</Text>
          </View>
        }
      />

      {/* TODO: fix flatlist and scrollview bug when bottom sheet is closed */}
      <ProductSelectSheet ref={sheetRef} item={selected} onChange={onSheetChange} />
    </KeyboardAvoidingView>
  )
}
