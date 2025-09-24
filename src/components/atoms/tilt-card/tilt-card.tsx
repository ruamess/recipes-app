import { useCallback } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { useFocusEffect } from 'expo-router'
import { Gyroscope } from 'expo-sensors'

import { Card } from 'components/atoms/card'

const RAD2DEG = 180 / Math.PI
function clamp(v: number, min: number, max: number) {
  'worklet'
  return Math.min(Math.max(v, min), max)
}

type TiltCardProps = React.ComponentProps<typeof Card> & {
  maxAngle?: number
  tiltEnabled?: boolean
}

export const TiltCard = ({ children, className, maxAngle = 15, ...props }: TiltCardProps) => {
  const rotateX = useSharedValue(0)
  const rotateY = useSharedValue(0)

  const rStyle = useAnimatedStyle(
    () => ({
      transform: [
        { perspective: 500 },
        { rotateX: `${rotateX.value}deg` },
        { rotateY: `${rotateY.value}deg` },
      ],
    }),
    [],
  )

  useFocusEffect(
    useCallback(() => {
      Gyroscope.setUpdateInterval(32)

      let prev = Date.now()
      const sub = Gyroscope.addListener((g) => {
        const now = Date.now()
        const dt = (now - prev) / 1000
        prev = now

        rotateX.value = clamp(rotateX.value + (g.x / 2) * dt * RAD2DEG, -maxAngle, maxAngle)
        rotateY.value = clamp(rotateY.value - (g.y / 2) * dt * RAD2DEG, -maxAngle, maxAngle)
      })

      return () => {
        rotateX.value = withTiming(0, { duration: 400 })
        rotateY.value = withTiming(0, { duration: 400 })
        sub.remove()
      }
    }, [maxAngle]),
  )

  return (
    <Animated.View style={rStyle}>
      <Card className={className} {...props}>
        {children}
      </Card>
    </Animated.View>
  )
}
