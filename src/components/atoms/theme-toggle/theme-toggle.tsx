import { MoonStarIcon, SunIcon } from 'lucide-react-native'

import { useColorScheme } from 'nativewind'

import { Button } from '../button'
import { Icon } from '../icon'

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
}

export const ThemeToggle = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme()

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="rounded-full web:mx-4"
    >
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="h-5 w-5" />
    </Button>
  )
}
