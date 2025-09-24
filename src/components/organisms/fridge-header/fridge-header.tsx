import { CalendarClock, Check, Filter } from 'lucide-react-native'
import { View } from 'react-native'

import type { FridgeFilter } from 'domain/fridge/filter/types'
import { FRIDGE_FILTER_LABEL } from 'domain/fridge/filter/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/atoms/dropdown-menu'
import { Icon } from 'components/atoms/icon'
import { Text } from 'components/atoms/text'
import { ThemeToggle } from 'components/atoms/theme-toggle'

type Props = {
  filter: FridgeFilter
  onChange: (f: FridgeFilter) => void
}

export function FridgeHeader({ filter, onChange }: Props) {
  const list: FridgeFilter[] = ['all', 'expiringSoon', 'expired', 'fresh', 'lowQty']
  return (
    <View className="w-full flex-row items-center justify-between">
      <Text className="text-2xl">My Fridge</Text>
      <View className="flex-row items-center gap-3">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <View className="flex-row items-center gap-2 rounded-full border border-border bg-card px-3 py-2">
              <Icon as={Filter} size={15} className="text-foreground/80" />
              <Text>{FRIDGE_FILTER_LABEL[filter]}</Text>
            </View>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-1 min-w-[200px] rounded-2xl border border-border bg-popover p-1">
            <DropdownMenuLabel className="px-2 py-1.5 text-xs text-foreground/70">
              Filter by
            </DropdownMenuLabel>
            {list.map((f) => (
              <DropdownMenuItem
                key={f}
                className="flex-row items-center justify-between rounded-lg px-2 py-2"
                onPress={() => onChange(f)}
              >
                <View className="flex-row items-center gap-2">
                  {f === 'expiringSoon' && (
                    <Icon as={CalendarClock} size={16} className="text-foreground/70" />
                  )}
                  <Text>{FRIDGE_FILTER_LABEL[f]}</Text>
                </View>
                {filter === f && <Icon as={Check} size={16} className="text-primary" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem className="rounded-lg px-2 py-2" onPress={() => onChange('all')}>
              <Text className="text-foreground/80">Reset</Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </View>
    </View>
  )
}
