import React, { forwardRef, useCallback, useImperativeHandle } from 'react'
import { Dimensions, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { cn } from 'shared/lib'

import { BottomSheetMethods, BottomSheetProps } from '../types'

import { BackDrop } from './back-drop'

const SPRING_CONFIG = { damping: 100, stiffness: 400 }
const SCREEN_HEIGHT = Dimensions.get('screen').height

export const BottomSheet = forwardRef<BottomSheetMethods, BottomSheetProps>(
  ({ snapTo, contentClassName, indicatorClassName, children }: BottomSheetProps, ref) => {
    const inset = useSafeAreaInsets()
    const percentage = parseFloat(snapTo.replace('%', '')) / 100
    const closeHeight = SCREEN_HEIGHT
    const openHeight = SCREEN_HEIGHT - SCREEN_HEIGHT * percentage
    const topAnimation = useSharedValue(closeHeight)
    const context = useSharedValue(0)

    const expand = useCallback(() => {
      'worklet'
      topAnimation.value = withTiming(openHeight)
    }, [openHeight, topAnimation])

    const close = useCallback(() => {
      'worklet'
      topAnimation.value = withTiming(closeHeight)
    }, [closeHeight, topAnimation])

    useImperativeHandle(
      ref,
      () => ({
        expand,
        close,
      }),
      [expand, close],
    )

    const animationStyle = useAnimatedStyle(() => {
      const top = topAnimation.value
      return {
        top,
      }
    })

    const pan = Gesture.Pan()
      .onBegin(() => {
        context.value = topAnimation.value
      })
      .onUpdate((event) => {
        if (event.translationY < 0) {
          topAnimation.value = withSpring(openHeight, SPRING_CONFIG)
        } else {
          topAnimation.value = withSpring(context.value + event.translationY, SPRING_CONFIG)
        }
      })
      .onEnd(() => {
        if (topAnimation.value > openHeight + 50) {
          topAnimation.value = withSpring(closeHeight, SPRING_CONFIG)
        } else {
          topAnimation.value = withSpring(openHeight, SPRING_CONFIG)
        }
      })

    return (
      <>
        <BackDrop
          topAnimation={topAnimation}
          closeHeight={closeHeight}
          openHeight={openHeight}
          close={close}
        />
        <GestureDetector gesture={pan}>
          <Animated.View
            className={cn('absolute inset-0 rounded-t-3xl bg-background', contentClassName)}
            style={[animationStyle, { paddingBottom: inset.bottom }]}
          >
            <View
              className={cn(
                'my-3 h-1 w-8 self-center rounded-xl bg-muted-foreground',
                indicatorClassName,
              )}
            />

            {children}
          </Animated.View>
        </GestureDetector>
      </>
    )
  },
)
