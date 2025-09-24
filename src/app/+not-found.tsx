import { View } from 'react-native'

import { Link, Stack } from 'expo-router'

import { Text } from 'components/atoms/text'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center gap-4">
        <Text className="text-2xl">This screen doesn't exist.</Text>

        <Link href="/">
          <Text className="text-lg">Go to home screen!</Text>
        </Link>
      </View>
    </>
  )
}
