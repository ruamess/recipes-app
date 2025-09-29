/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-native/no-inline-styles */
import { useCallback, useEffect, useState } from 'react'
import {
  Dimensions,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

import { Text } from 'components/atoms/text'
import { useKeyboardHeight } from 'shared/lib/useKeyboardHeight'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

/**
 * Animation tuning constants
 */
const ANIM = {
  SPRING_OPEN: { damping: 50, stiffness: 400, mass: 1 }, // opens with slight overshoot
  SPRING_CLOSE: { damping: 50, stiffness: 400, mass: 1 }, // quicker close
  TIMING_OPEN_MS: 300,
  TIMING_CLOSE_MS: 300,
  CONTENT_SCALE_OPEN: 1,
  CONTENT_SCALE_CLOSED: 1,
}

type BottomSheetContentProps = {
  children: React.ReactNode
  title?: string
  style?: ViewStyle
  rBottomSheetStyle: any
  onHandlePress?: () => void
}

// Wrapped content with animated container and improved visual polish
const BottomSheetContent = ({
  children,
  title,
  style,
  rBottomSheetStyle,
  onHandlePress,
}: BottomSheetContentProps) => {
  return (
    <Animated.View
      className="absolute w-full rounded-t-3xl bg-background"
      style={[
        {
          height: SCREEN_HEIGHT,
          top: SCREEN_HEIGHT,
        },
        rBottomSheetStyle,
        style,
      ]}
    >
      {/* Handle */}
      <TouchableWithoutFeedback onPress={onHandlePress}>
        <View className="w-full items-center py-3">
          <View className="h-1 w-9 rounded-full bg-muted" />
        </View>
      </TouchableWithoutFeedback>

      {/* Title */}
      {title && (
        <View className="mx-4 mt-4 pb-2">
          <Text variant="large" className="text-center">
            {title}
          </Text>
        </View>
      )}

      {/* Content scroll area */}
      <ScrollView
        className="flex-1 p-4 pb-10"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </Animated.View>
  )
}

type BottomSheetProps = {
  isVisible: boolean
  onClose: () => void
  children: React.ReactNode
  snapPoints?: number[]
  enableBackdropDismiss?: boolean
  title?: string
  style?: ViewStyle
  disablePanGesture?: boolean
}

export function BottomSheet({
  isVisible,
  onClose,
  children,
  snapPoints = [0.3, 0.6, 0.9],
  enableBackdropDismiss = true,
  title,
  style,
  disablePanGesture = false,
}: BottomSheetProps) {
  const { keyboardHeight, isKeyboardVisible } = useKeyboardHeight()

  const translateY = useSharedValue(0)
  const context = useSharedValue({ y: 0 })
  const backdrop = useSharedValue(0) // 0..1 - animated opacity for the backdrop
  const contentScale = useSharedValue(ANIM.CONTENT_SCALE_CLOSED)
  const currentSnapIndex = useSharedValue(0)
  const keyboardHeightSV = useSharedValue(0)

  const snapPointsHeights = snapPoints.map((point) => -SCREEN_HEIGHT * point)
  const defaultHeight = snapPointsHeights[0]
  const minSnapPoint = Math.min(...snapPointsHeights)

  const [modalVisible, setModalVisible] = useState(false)

  // Opening/closing animations with configurable spring/timing
  useEffect(() => {
    if (isVisible) {
      setModalVisible(true)
      translateY.value = withSpring(defaultHeight, ANIM.SPRING_OPEN)
      backdrop.value = withTiming(1, { duration: ANIM.TIMING_OPEN_MS })
      contentScale.value = withTiming(ANIM.CONTENT_SCALE_OPEN, { duration: ANIM.TIMING_OPEN_MS })
      currentSnapIndex.value = 0
    } else {
      translateY.value = withSpring(0, ANIM.SPRING_CLOSE)
      backdrop.value = withTiming(0, { duration: ANIM.TIMING_CLOSE_MS }, (finished) => {
        if (finished) runOnJS(setModalVisible)(false)
      })
      contentScale.value = withTiming(ANIM.CONTENT_SCALE_CLOSED, { duration: ANIM.TIMING_CLOSE_MS })
    }
  }, [isVisible, defaultHeight])

  // Keep shared keyboard height updated and shift sheet if keyboard opens
  useEffect(() => {
    keyboardHeightSV.value = keyboardHeight
    if (isVisible) {
      const currentSnapHeight = snapPointsHeights[currentSnapIndex.value]
      const destination = isKeyboardVisible ? currentSnapHeight - keyboardHeight : currentSnapHeight
      translateY.value = withSpring(destination, ANIM.SPRING_OPEN)
    }
  }, [keyboardHeight, isKeyboardVisible, isVisible])

  const scrollTo = (destination: number, velocity = 0) => {
    'worklet'
    translateY.value = withSpring(destination, { ...ANIM.SPRING_OPEN, velocity })
  }

  const findClosestSnapPoint = (currentY: number) => {
    'worklet'
    const adjustedY = currentY + keyboardHeightSV.value
    let closest = snapPointsHeights[0]
    let minDistance = Math.abs(adjustedY - closest)
    let closestIndex = 0

    for (let i = 0; i < snapPointsHeights.length; i++) {
      const snapPoint = snapPointsHeights[i]
      const distance = Math.abs(adjustedY - snapPoint)
      if (distance < minDistance) {
        minDistance = distance
        closest = snapPoint
        closestIndex = i
      }
    }
    currentSnapIndex.value = closestIndex
    return closest
  }

  const handlePress = () => {
    const nextIndex = (currentSnapIndex.value + 1) % snapPointsHeights.length
    currentSnapIndex.value = nextIndex
    const destination = snapPointsHeights[nextIndex] - keyboardHeightSV.value
    scrollTo(destination)
  }

  const animateClose = () => {
    'worklet'
    translateY.value = withSpring(0, ANIM.SPRING_CLOSE)
    backdrop.value = withTiming(0, { duration: ANIM.TIMING_CLOSE_MS })
    contentScale.value = withTiming(
      ANIM.CONTENT_SCALE_CLOSED,
      { duration: ANIM.TIMING_CLOSE_MS },
      (finished) => {
        if (finished) runOnJS(onClose)()
      },
    )
  }

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value }
    })
    .onUpdate((event) => {
      const newY = context.value.y + event.translationY
      if (newY <= 0 && newY >= minSnapPoint) {
        translateY.value = newY
      } else if (newY > 0) {
        translateY.value = 0
      } else if (newY < minSnapPoint) {
        translateY.value = minSnapPoint
      }
    })
    .onEnd((event) => {
      const currentY = translateY.value
      const velocity = event.velocityY

      // quick flick down closes sheet
      if (velocity > 1200 || (velocity > 600 && currentY > -SCREEN_HEIGHT * 0.25)) {
        animateClose()
        return
      }

      const closestSnapPoint = findClosestSnapPoint(currentY)
      const finalDestination = closestSnapPoint - keyboardHeightSV.value
      scrollTo(finalDestination, velocity)
    })

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }, { scale: contentScale.value }],
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -6 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 24,
    }
  })

  // Backdrop opacity animated; background color comes from tailwind class (bg-foreground)
  const rBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: backdrop.value,
    }
  })

  const handleBackdropPress = () => {
    if (enableBackdropDismiss) {
      animateClose()
    }
  }

  return (
    <Modal visible={modalVisible} transparent statusBarTranslucent animationType="none">
      <GestureHandlerRootView className="flex-1">
        {/* Backdrop: use full bg-foreground color and animate opacity via rBackdropStyle */}
        <Animated.View className="flex-1 bg-foreground/40" style={rBackdropStyle}>
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <Animated.View className="flex-1" />
          </TouchableWithoutFeedback>

          {disablePanGesture ? (
            <BottomSheetContent
              title={title}
              style={style}
              rBottomSheetStyle={rBottomSheetStyle}
              onHandlePress={() => runOnJS(handlePress)()}
            >
              {children}
            </BottomSheetContent>
          ) : (
            <GestureDetector gesture={gesture}>
              <BottomSheetContent
                title={title}
                style={style}
                rBottomSheetStyle={rBottomSheetStyle}
                onHandlePress={() => runOnJS(handlePress)()}
              >
                {children}
              </BottomSheetContent>
            </GestureDetector>
          )}
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  )
}

// Hook for managing bottom sheet state
export function useBottomSheet() {
  const [isVisible, setIsVisible] = useState(false)

  const open = useCallback(() => {
    setIsVisible(true)
  }, [])

  const close = useCallback(() => {
    setIsVisible(false)
  }, [])

  const toggle = useCallback(() => {
    setIsVisible((prev) => !prev)
  }, [])

  return {
    isVisible,
    open,
    close,
    toggle,
  }
}
