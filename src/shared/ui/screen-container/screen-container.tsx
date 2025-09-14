import { View, ViewProps } from 'react-native'

import { cn } from 'shared/lib'

export const ScreenContainer = ({ className, ...props }: ViewProps & React.RefAttributes<View>) => {
  return <View className={cn('flex-1 p-4', className)} {...props} />
}
