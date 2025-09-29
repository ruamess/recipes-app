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

type BottomSheetContentProps = {
  children: React.ReactNode
  title?: string
  style?: ViewStyle
  rBottomSheetStyle: any
  onHandlePress?: () => void
}

// Component for the bottom sheet content
// It now includes a ScrollView by default for better form handling.
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
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            paddingBottom: 8,
          }}
        >
          <Text variant="large" className="text-center">
            {title}
          </Text>
        </View>
      )}

      {/* Content now wrapped in a ScrollView */}
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
  const opacity = useSharedValue(0)
  const currentSnapIndex = useSharedValue(0)
  // Shared value to hold keyboard height for use in worklets
  const keyboardHeightSV = useSharedValue(0)

  const snapPointsHeights = snapPoints.map((point) => -SCREEN_HEIGHT * point)
  const defaultHeight = snapPointsHeights[0]

  const [modalVisible, setModalVisible] = useState(false)

  // Effect to handle opening and closing the bottom sheet
  useEffect(() => {
    if (isVisible) {
      setModalVisible(true)
      translateY.value = withSpring(defaultHeight, {
        damping: 50,
        stiffness: 400,
      })
      opacity.value = withTiming(1, { duration: 300 })
      currentSnapIndex.value = 0
    } else {
      translateY.value = withSpring(0, { damping: 50, stiffness: 400 })
      opacity.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished) {
          runOnJS(setModalVisible)(false)
        }
      })
    }
  }, [isVisible, defaultHeight])

  // Function to animate the sheet to a specific destination
  const scrollTo = (destination: number) => {
    'worklet'
    translateY.value = withSpring(destination, { damping: 50, stiffness: 400 })
  }

  // --- START: NEW KEYBOARD HANDLING LOGIC ---
  useEffect(() => {
    // Update the shared value whenever keyboardHeight changes
    keyboardHeightSV.value = keyboardHeight

    // Only adjust position if the sheet is currently visible
    if (isVisible) {
      const currentSnapHeight = snapPointsHeights[currentSnapIndex.value]
      let destination: number

      if (isKeyboardVisible) {
        // Keyboard is open, move sheet up by keyboard height
        destination = currentSnapHeight - keyboardHeight
      } else {
        // Keyboard is closed, return to original snap point
        destination = currentSnapHeight
      }
      scrollTo(destination)
    }
  }, [keyboardHeight, isKeyboardVisible, isVisible])
  // --- END: NEW KEYBOARD HANDLING LOGIC ---

  const findClosestSnapPoint = (currentY: number) => {
    'worklet'
    // Adjust the currentY by the keyboard height to find the original snap point
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
    translateY.value = withSpring(0, { damping: 50, stiffness: 400 })
    opacity.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(onClose)()
      }
    })
  }

  const minSnapPoint = Math.min(...snapPointsHeights) // самый верхний snap

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value }
    })
    .onUpdate((event) => {
      const newY = context.value.y + event.translationY
      // Ограничение: не даём тянуть выше верхнего snap и ниже "0"
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

      if (velocity > 500 && currentY > -SCREEN_HEIGHT * 0.2) {
        animateClose()
        return
      }

      const closestSnapPoint = findClosestSnapPoint(currentY)
      const finalDestination = closestSnapPoint - keyboardHeightSV.value
      scrollTo(finalDestination)
    })

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    }
  })

  const rBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  const handleBackdropPress = () => {
    if (enableBackdropDismiss) {
      animateClose()
    }
  }

  return (
    <Modal visible={modalVisible} transparent statusBarTranslucent animationType="none">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View className="flex-1 bg-foreground/40" style={rBackdropStyle}>
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <Animated.View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          {disablePanGesture ? (
            <BottomSheetContent
              children={children}
              title={title}
              style={style}
              rBottomSheetStyle={rBottomSheetStyle}
              onHandlePress={() => runOnJS(handlePress)()}
            />
          ) : (
            <GestureDetector gesture={gesture}>
              <BottomSheetContent
                children={children}
                title={title}
                style={style}
                rBottomSheetStyle={rBottomSheetStyle}
                onHandlePress={() => runOnJS(handlePress)()}
              />
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
