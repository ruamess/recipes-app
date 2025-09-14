import { ArrowRight } from 'lucide-react-native'
import { View } from 'react-native'

import { Button } from 'shared/ui/button'
import { Card, CardContent } from 'shared/ui/card'
import { Icon } from 'shared/ui/icon'
import { Text } from 'shared/ui/text'

export default function Screen() {
  return (
    <View className="flex-1 items-center justify-center gap-5 p-6">
      <View className="w-full gap-2">
        <Card className="w-full max-w-sm rounded-2xl py-4">
          <CardContent className="flex-row items-center justify-between">
            <View className="flex-row gap-3">
              <Text>🥩</Text>
              <Text>Beef</Text>
            </View>
            <Text>200 g</Text>
          </CardContent>
        </Card>

        <Card className="w-full max-w-sm rounded-2xl py-4">
          <CardContent className="flex-row items-center justify-between">
            <View className="flex-row gap-3">
              <Text>🥑</Text>
              <Text>Avocado</Text>
            </View>
            <Text>200 g</Text>
          </CardContent>
        </Card>
      </View>

      <Button variant="outline" className="flex h-14 w-full flex-row gap-2">
        <Text>Next</Text>
        <Icon as={ArrowRight} className="text-foreground" size={20} strokeWidth={1.2} />
      </Button>
    </View>
  )
}
