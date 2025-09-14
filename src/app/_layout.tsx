import { ThemeProvider } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'

import { Image } from 'expo-image'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'

import { PortalHost } from '@rn-primitives/portal'
import { cssInterop } from 'nativewind'
import { useColorScheme } from 'nativewind'
import { NAV_THEME } from 'shared/lib'
import { ThemeToggle } from 'shared/ui/theme-toggle'

import '../../global.css'

if (!__DEV__) {
  SplashScreen.preventAutoHideAsync()
  SplashScreen.setOptions({ duration: 300, fade: true })
}

cssInterop(Image, { className: 'style' })

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export default function RootLayout() {
  const { colorScheme } = useColorScheme()

  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 200))
      } catch (e) {
        console.warn(e)
      } finally {
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hideAsync()
    }
  }, [appIsReady])

  if (!appIsReady) return null

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <View className="flex-1 bg-background" onLayout={onLayoutRootView}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerTitleAlign: 'center',
            animation: 'slide_from_right',
            headerShadowVisible: false,
            // to hide previous screen's title
            headerBackButtonDisplayMode: 'minimal',
            // remove back button title when holding on ios but idk is this work
            headerBackTitle: '',
            headerBackButtonMenuEnabled: false,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'Fridge',
              headerRight: () => <ThemeToggle />,
            }}
          />
          <Stack.Screen
            name="lets-start"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
        <PortalHost />
      </View>
    </ThemeProvider>
  )
}
