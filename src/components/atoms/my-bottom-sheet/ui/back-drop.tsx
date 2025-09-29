import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import Animated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated'

type Props = {
  topAnimation: SharedValue<number>
  openHeight: number
  closeHeight: number
  close: () => void
}

export const BackDrop = ({ topAnimation, openHeight, closeHeight, close }: Props) => {
  const backDropAnimation = useAnimatedStyle(() => {
    const opacity = interpolate(topAnimation.value, [closeHeight, openHeight], [0, 0.5])
    const display = opacity === 0 ? 'none' : 'flex'
    return {
      opacity,
      display,
    }
  })
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        close()
      }}
    >
      <Animated.View
        className="absolute inset-0 bg-muted-foreground/80"
        style={backDropAnimation}
      />
    </TouchableWithoutFeedback>
  )
}
