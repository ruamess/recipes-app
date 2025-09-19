import { CalendarClock, Check, Filter, Plus, Trash2 } from 'lucide-react-native'
import { useCallback, useMemo, useRef, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRouter } from 'expo-router'

import BottomSheet from '@gorhom/bottom-sheet'
import dayjs from 'dayjs'
import type { FridgeItem, Product } from 'entities/product/model/types'
import { fridgeItems } from 'shared/data/fridgeItems'
import { products } from 'shared/data/products'
import { MyBottomSheet } from 'shared/ui/bottom-sheet'
import { Button } from 'shared/ui/button'
import { Card, CardContent } from 'shared/ui/card'
import { CircularExpiryProgress } from 'shared/ui/circular-expiry-progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'shared/ui/dropdown-menu'
import { Icon } from 'shared/ui/icon'
import { Text } from 'shared/ui/text'
import { ThemeToggle } from 'shared/ui/theme-toggle'

type FilterKey = 'all' | 'expiringSoon' | 'expired' | 'fresh' | 'lowQty'

function diffDaysFromNow(expire?: string) {
  if (!expire) return undefined
  const d = dayjs(expire)
  if (!d.isValid()) return undefined
  return Math.ceil(d.diff(dayjs(), 'day', true))
}

export default function Screen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const bottomSheetRef = useRef<BottomSheet>(null)
  const [selectedProduct, setSelectedProduct] = useState<FridgeItem | null>(null)
  const [filter, setFilter] = useState<FilterKey>('all')

  // Быстрый доступ к продуктам по id
  const productsById = useMemo(() => {
    const map: Record<number, Product> = {}
    for (const p of products) map[p.id] = p
    return map
  }, [])

  const filterLabel: Record<FilterKey, string> = {
    all: 'All items',
    expiringSoon: 'Expiring soon',
    expired: 'Expired',
    fresh: 'Fresh',
    lowQty: 'Low qty',
  }

  const filteredItems = useMemo(() => {
    const items = fridgeItems.filter((it) => !!productsById[it.productId])
    const passes = (it: FridgeItem) => {
      const daysLeft = diffDaysFromNow(it.expire)
      switch (filter) {
        case 'expiringSoon':
          return daysLeft !== undefined && daysLeft >= 0 && daysLeft <= 3
        case 'expired':
          return daysLeft !== undefined && daysLeft < 0
        case 'fresh':
          return daysLeft === undefined || daysLeft > 3
        case 'lowQty':
          return (it.quantity ?? 0) <= 1
        default:
          return true
      }
    }
    const rank = (days?: number) => (days == null ? 9999 : days)
    return items.filter(passes).sort((a, b) => {
      const da = diffDaysFromNow(a.expire)
      const db = diffDaysFromNow(b.expire)
      // просроченные первыми
      if ((da ?? 9999) < 0 && (db ?? 9999) >= 0) return -1
      if ((db ?? 9999) < 0 && (da ?? 9999) >= 0) return 1
      // меньше дней — выше
      if (rank(da) !== rank(db)) return rank(da) - rank(db)
      const pa = productsById[a.productId]
      const pb = productsById[b.productId]
      return (pa?.name ?? '').localeCompare(pb?.name ?? '')
    })
  }, [filter, productsById])

  const handleProductPress = (item: FridgeItem) => {
    setSelectedProduct(item)
    bottomSheetRef.current?.expand()
  }

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close()
  }, [])

  const onSheetChanges = useCallback((index: number) => {
    if (index < 0) setSelectedProduct(null)
  }, [])

  const selected = selectedProduct ? productsById[selectedProduct.productId] : undefined

  return (
    <View
      style={{ paddingTop: insets.top + 20 }}
      className="flex-1 items-center justify-center gap-8 p-4"
    >
      <View className="w-full flex-row items-center justify-between">
        <Text className="self-start text-2xl">My Fridge</Text>

        <View className="flex-row items-center gap-3">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <View className="flex-row items-center gap-2 rounded-full border border-border bg-card px-3 py-2">
                <Icon as={Filter} size={15} className="text-foreground/80" />
                <Text className="text-foreground">{filterLabel[filter]}</Text>
              </View>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="mt-1 min-w-[200px] rounded-2xl border border-border bg-popover p-1">
              <DropdownMenuLabel className="px-2 py-1.5 text-xs text-foreground/70">
                Filter by
              </DropdownMenuLabel>

              <DropdownMenuItem
                className="flex-row items-center justify-between rounded-lg px-2 py-2"
                onPress={() => setFilter('all')}
              >
                <Text>All items</Text>
                {filter === 'all' && <Icon as={Check} size={16} className="text-primary" />}
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex-row items-center justify-between rounded-lg px-2 py-2"
                onPress={() => setFilter('expiringSoon')}
              >
                <View className="flex-row items-center gap-2">
                  <Icon as={CalendarClock} size={16} className="text-foreground/70" />
                  <Text>Expiring soon</Text>
                </View>
                {filter === 'expiringSoon' && (
                  <Icon as={Check} size={16} className="text-primary" />
                )}
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex-row items-center justify-between rounded-lg px-2 py-2"
                onPress={() => setFilter('expired')}
              >
                <Text>Expired</Text>
                {filter === 'expired' && <Icon as={Check} size={16} className="text-primary" />}
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex-row items-center justify-between rounded-lg px-2 py-2"
                onPress={() => setFilter('fresh')}
              >
                <Text>Fresh</Text>
                {filter === 'fresh' && <Icon as={Check} size={16} className="text-primary" />}
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex-row items-center justify-between rounded-lg px-2 py-2"
                onPress={() => setFilter('lowQty')}
              >
                <Text>Low qty</Text>
                {filter === 'lowQty' && <Icon as={Check} size={16} className="text-primary" />}
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1" />

              <DropdownMenuItem className="rounded-lg px-2 py-2" onPress={() => setFilter('all')}>
                <Text className="text-foreground/80">Reset</Text>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </View>
      </View>

      <Animated.ScrollView
        className="h-full w-full"
        contentContainerClassName="gap-2"
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.map((item) => {
          const product = productsById[item.productId]
          if (!product) return null
          return (
            <TouchableOpacity
              activeOpacity={0.5}
              key={item.id}
              onPress={() => handleProductPress(item)}
            >
              <Card className="w-full max-w-sm rounded-2xl py-4">
                <CardContent className="flex-row items-center justify-between px-4">
                  <View className="flex-row items-center gap-3">
                    <Text>{product.emoji}</Text>
                    <Text>{product.name}</Text>
                  </View>

                  <CircularExpiryProgress
                    showDaysLabel={false}
                    expire={item.expire}
                    size={25}
                    strokeWidth={3.5}
                  />
                </CardContent>
              </Card>
            </TouchableOpacity>
          )
        })}
      </Animated.ScrollView>

      <Button
        onPress={() => router.push('/add-fridge-item')}
        className="absolute bottom-6 right-4 h-fit w-fit rounded-full p-5"
      >
        <Icon as={Plus} size={22} className="text-2xl text-background" />
      </Button>

      <MyBottomSheet
        backgroundStyle="bg-background rounded-t-3xl"
        indicatorStyle="bg-foreground/20"
        ref={bottomSheetRef}
        index={-1}
        onChange={onSheetChanges}
        contentClassName="px-6 pt-4 pb-8 gap-8"
      >
        <View className="w-full flex-row items-center justify-center gap-3">
          <Text className="text-lg">{selected?.emoji}</Text>
          <Text className="text-lg">{selected?.name}</Text>
        </View>

        <View className="w-full gap-5">
          <View className="w-full flex-row items-center justify-between">
            <Text>Quantity</Text>
            <View className="flex-row items-center gap-1">
              <Text>{selectedProduct?.quantity ?? '—'}</Text>
              <Text>{selected?.unit}</Text>
            </View>
          </View>
          {selectedProduct?.storage && (
            <View className="w-full flex-row items-center justify-between">
              <Text>Storage</Text>
              <View className="flex-row items-center gap-1">
                <Text>{selectedProduct?.storage ?? '—'}</Text>
              </View>
            </View>
          )}
          <View className="w-full flex-row items-center justify-between">
            <Text>Expire date</Text>
            <View className="flex-row items-center gap-3">
              <Text>{dayjs(selectedProduct?.expire ?? '—').format('DD.MM.YYYY')}</Text>
            </View>
          </View>
          {selectedProduct?.brand && (
            <View className="w-full flex-row items-center justify-between">
              <Text>Brand</Text>
              <Text>{selectedProduct?.brand ?? '—'}</Text>
            </View>
          )}
        </View>

        <Button
          variant="destructive"
          className="flex h-12 w-full flex-row items-center justify-center gap-2"
          onPress={handleClosePress}
        >
          <Icon className="text-white" as={Trash2} size={20} strokeWidth={1.2} />
          <Text>Remove</Text>
        </Button>
      </MyBottomSheet>
    </View>
  )
}
