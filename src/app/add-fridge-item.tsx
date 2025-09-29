/* eslint-disable react-native/no-inline-styles */
import { ArrowLeft } from 'lucide-react-native'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRouter } from 'expo-router'

import { Badge } from 'components/atoms/badge'
import { useBottomSheet } from 'components/atoms/bottom-sheet'
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

const ProductRowComp = memo(
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

const HeaderRow = memo(({ letter }: { letter: string }) => (
  <View className="bg-background px-1 py-1">
    <Text className="text-xs font-medium text-muted-foreground">{letter}</Text>
  </View>
))

const EmptyComponent = () => (
  <View className="my-40 flex-1 items-center justify-center">
    <Text className="text-lg font-medium text-muted-foreground">Nothing found</Text>
    <Text className="mt-2 text-sm text-muted-foreground">Try to change filters</Text>
  </View>
)

export default function ProductPicker() {
  const { isVisible, open, close } = useBottomSheet()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [selected, setSelected] = useState<Product | null>(null)

  const [category, setCategory] = useState<ProductCategory | 'all'>('all')
  const [queryInput, setQueryInput] = useState('')
  const query = useDebouncedValue(queryInput, 250)

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  )

  // Caches
  const filterCacheRef = useRef<Map<string, Product[]>>(new Map())
  const rowsCacheRef = useRef<Map<string, ProductRow[]>>(new Map())

  const filtered = useMemo(() => {
    const key = `${category}|${query.trim().toLowerCase()}`
    const cached = filterCacheRef.current.get(key)
    if (cached) return cached
    const result = filterProducts(sortedProducts, query, category)
    filterCacheRef.current.set(key, result)
    return result
  }, [sortedProducts, query, category])

  const filteredKey = useMemo(() => filtered.map((p) => p.id).join(','), [filtered])

  const rows = useMemo(() => {
    const cached = rowsCacheRef.current.get(filteredKey)
    if (cached) return cached
    const r = buildProductRows(filtered)
    rowsCacheRef.current.set(filteredKey, r)
    return r
  }, [filteredKey, filtered])

  const allCategories = useMemo<ProductCategory[]>(
    () =>
      Array.from(new Set(products.map((p) => p.category))).sort((a, b) =>
        CATEGORY_LABELS[a].localeCompare(CATEGORY_LABELS[b]),
      ),
    [],
  )

  const handlePick = useCallback(
    (p: Product) => {
      setSelected(p)
      open()
      console.log('Pick product:', p.id, p.name)
    },
    [open],
  )

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
        <ProductRowComp product={item.product} onPick={handlePick} />
      ),
    [handlePick],
  )

  // Precomputed layout for smooth virtualization
  const HEADER_HEIGHT = 28
  const ROW_HEIGHT = 64
  const layout = useMemo(() => {
    const lengths = rows.map((r) => (r.type === 'header' ? HEADER_HEIGHT : ROW_HEIGHT))
    const offsets: number[] = new Array(lengths.length)
    let acc = 0
    for (let i = 0; i < lengths.length; i++) {
      offsets[i] = acc
      acc += lengths[i]
    }
    return { lengths, offsets }
  }, [rows])

  const getItemLayout = useCallback(
    (_data: ArrayLike<ProductRow> | null | undefined, index: number) => ({
      length: layout.lengths[index],
      offset: layout.offsets[index],
      index,
    }),
    [layout],
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
            onPress={() => {
              console.log('Selected category:', c)
              setCategory(c)
            }}
          />
        ))}
      </ScrollView>

      <FlatList
        data={rows}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyComponent />}
        getItemLayout={getItemLayout}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        updateCellsBatchingPeriod={16}
        windowSize={10}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 12 }}
      />

      <ProductSelectSheet isVisible={isVisible} onClose={close} item={selected} />
    </View>
  )
}
