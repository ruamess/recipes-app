/* eslint-disable react-native/no-inline-styles */
import { ArrowLeft } from 'lucide-react-native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRouter } from 'expo-router'

import BottomSheet from '@gorhom/bottom-sheet'
import { LegendList } from '@legendapp/list'
import { Badge } from 'components/atoms/badge'
import { Button } from 'components/atoms/button'
import { Card } from 'components/atoms/card'
import { Icon } from 'components/atoms/icon'
import { Input } from 'components/atoms/input'
import { Text } from 'components/atoms/text'
import { CategoryChip } from 'components/molecules/category-chip'
import { ProductSelectSheet } from 'components/organisms/product-select-sheet'
import { CATEGORY_LABELS, type Product, type ProductCategory } from 'domain/product/item/types'
import { buildProductRows, filterProducts } from 'domain/product/search/buildRows'
import type { ProductRow } from 'domain/product/search/types'
import { products } from 'shared/data/products'
import { useDebouncedValue } from 'shared/lib/useDebouncedValue'

const ProductRow = React.memo(
  ({ product, onPick }: { product: Product; onPick: (p: Product) => void }) => (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onPick(product)}>
      <Card className="mb-2 w-full rounded-xl border border-border/60 bg-card px-3 py-3">
        <View className="w-full flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Text className="text-lg">{product.emoji}</Text>
            </View>
            <View>
              <Text className="text-base">{product.name}</Text>
              <Text className="text-xs capitalize text-muted-foreground">
                {CATEGORY_LABELS[product.category]}
              </Text>
            </View>
          </View>
          <Badge variant="secondary">
            <Text>{product.unit}</Text>
          </Badge>
        </View>
      </Card>
    </TouchableOpacity>
  ),
)

const HeaderRow = React.memo(({ letter }: { letter: string }) => (
  <View className="bg-background px-1 py-1">
    <Text className="text-xs font-medium text-muted-foreground">{letter}</Text>
  </View>
))

const EmptyComponent = () => (
  <View className="my-40 flex-1 items-center justify-center">
    <Text className="text-lg font-medium text-muted-foreground">Nothing found</Text>
    <Text className="mt-2 text-sm text-muted-foreground">Попробуйте изменить фильтры</Text>
  </View>
)

export default function ProductPicker() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const sheetRef = useRef<BottomSheet>(null)
  const [selected, setSelected] = useState<Product | null>(null)

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

  const onSheetChange = useCallback((i: number) => {
    if (i < 0) setSelected(null)
  }, [])

  const keyExtractor = useCallback(
    (item: ProductRow, i: number) =>
      item.type === 'header' ? `h-${item.letter}-${i}` : `p-${item.product.id}`,
    [],
  )

  const renderItem = useCallback(
    ({ item }: { item: ProductRow }) =>
      item.type === 'header' ? (
        <HeaderRow letter={item.letter} />
      ) : (
        <ProductRow product={item.product} onPick={handlePick} />
      ),
    [handlePick],
  )

  return (
    <View style={{ paddingTop: insets.top + 20 }} className="flex-1 gap-4 bg-background px-4">
      {/* Header */}
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
        contentContainerStyle={{ paddingHorizontal: 2, alignItems: 'center', gap: 8 }}
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

      <LegendList
        data={rows}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyComponent />}
        estimatedItemSize={56}
        contentContainerStyle={{ paddingBottom: insets.bottom + 12 }}
        showsVerticalScrollIndicator={false}
      />

      <ProductSelectSheet ref={sheetRef} item={selected} onChange={onSheetChange} />
    </View>
  )
}
