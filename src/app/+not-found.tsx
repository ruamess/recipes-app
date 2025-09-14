import { View } from 'react-native'

import { Link, Stack } from 'expo-router'

import { Text } from 'shared/ui/text'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center gap-4 bg-secondary/30">
        <Text className="text-2xl">This screen doesn't exist.</Text>

        <Link href="/">
          <Text className="text-lg">Go to home screen!</Text>
        </Link>
      </View>
    </>
  )
}
