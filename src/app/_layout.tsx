import { ThemeProvider } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { Image } from 'expo-image'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'

import { PortalHost } from '@rn-primitives/portal'
import { cssInterop } from 'nativewind'
import { useColorScheme } from 'nativewind'
import { NAV_THEME } from 'shared/lib'

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
    <GestureHandlerRootView className="flex-1" onLayout={onLayoutRootView}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <View className="flex-1 bg-background">
          <Stack
            screenOptions={{
              headerTitleAlign: 'center',
              animation: 'slide_from_right',
              headerShown: false,
              headerShadowVisible: false,
              headerBackButtonDisplayMode: 'minimal',
              headerBackTitle: '',
              headerBackButtonMenuEnabled: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen
              name="add-fridge-item"
              options={{
                title: 'Add Fridge Item',
                presentation: 'card',
                animation: 'slide_from_bottom',
              }}
            />
          </Stack>
          <PortalHost />
        </View>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}
