import { AlertCircle, Check, Info, X } from 'lucide-react-native'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Dimensions, Platform, Pressable, TouchableOpacity, View, ViewStyle } from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { cn } from 'shared/lib/utils'

import { Icon } from '../icon'
import { Text } from '../text'

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

export interface ToastData {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
  action?: {
    label: string
    onPress: () => void
  }
}

interface ToastProps extends ToastData {
  onDismiss: (id: string) => void
  index: number
}

const { width: screenWidth } = Dimensions.get('window')
const DYNAMIC_ISLAND_HEIGHT = 37
const EXPANDED_HEIGHT = 85
const TOAST_MARGIN = 8
const DYNAMIC_ISLAND_WIDTH = 126
const EXPANDED_WIDTH = screenWidth - 32

const SPRING_CONFIG = { stiffness: 120, damping: 8 }

export function Toast({
  id,
  title,
  description,
  variant = 'default',
  onDismiss,
  index,
  action,
}: ToastProps) {
  const insets = useSafeAreaInsets()

  const [isExpanded, setIsExpanded] = useState(false)

  const translateY = useSharedValue(-100)
  const translateX = useSharedValue(0)
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.9)
  const width = useSharedValue(DYNAMIC_ISLAND_WIDTH)
  const height = useSharedValue(DYNAMIC_ISLAND_HEIGHT)
  const borderRadius = useSharedValue(18)
  const contentOpacity = useSharedValue(0)

  useEffect(() => {
    const hasContent = Boolean(title || description || action)
    if (hasContent) {
      width.value = EXPANDED_WIDTH
      height.value = EXPANDED_HEIGHT
      borderRadius.value = 16
      setIsExpanded(true)
      translateY.value = withSpring(0, SPRING_CONFIG)
      opacity.value = withTiming(1, { duration: 300 })
      scale.value = withSpring(1, SPRING_CONFIG)
      contentOpacity.value = withDelay(100, withTiming(1, { duration: 260 }))
    } else {
      setIsExpanded(false)
      translateY.value = withSpring(0, SPRING_CONFIG)
      opacity.value = withTiming(1, { duration: 200 })
      scale.value = withSpring(1, SPRING_CONFIG)
    }
    // run once on mount
  }, [])

  const variantBgClass = (() => {
    switch (variant) {
      case 'success':
        return 'bg-success'
      case 'error':
        return 'bg-destructive'
      case 'warning':
        return 'bg-amber-500'
      case 'info':
        return 'bg-blue-500'
      default:
        return 'bg-muted'
    }
  })()

  const variantIconColor = (() => {
    switch (variant) {
      case 'success':
        return '#30D158' // iOS green
      case 'error':
        return '#FF453A' // iOS red
      case 'warning':
        return '#FF9F0A' // iOS orange
      case 'info':
        return '#007AFF' // iOS blue
      default:
        return '#8E8E93' // iOS gray
    }
  })()

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <Icon as={Check} size={16} color={variantIconColor} />
      case 'error':
        return <Icon as={X} size={16} color={variantIconColor} />
      case 'warning':
        return <Icon as={AlertCircle} size={16} color={variantIconColor} />
      case 'info':
        return <Icon as={Info} size={16} color={variantIconColor} />
      default:
        return null
    }
  }

  const dismiss = useCallback(() => {
    const onDismissAction = () => {
      'worklet'
      runOnJS(onDismiss)(id)
    }
    translateY.value = withSpring(-100, SPRING_CONFIG)
    opacity.value = withTiming(0, { duration: 250 }, (finished) => {
      if (finished) onDismissAction()
    })
    scale.value = withSpring(0.9, SPRING_CONFIG)
  }, [id, onDismiss])

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event
      if (Math.abs(translationX) > screenWidth * 0.25 || Math.abs(velocityX) > 800) {
        const onDismissAction = () => {
          'worklet'
          runOnJS(onDismiss)(id)
        }
        translateX.value = withTiming(translationX > 0 ? screenWidth : -screenWidth, {
          duration: 250,
        })
        opacity.value = withTiming(0, { duration: 250 }, (finished) => {
          if (finished) onDismissAction()
        })
      } else {
        translateX.value = withSpring(0, SPRING_CONFIG)
      }
    })

  const getTopPosition = () => {
    const statusBarOffset = Platform.OS === 'ios' ? 59 : 20
    return statusBarOffset + index * (EXPANDED_HEIGHT + TOAST_MARGIN)
  }

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }))

  const animatedIslandStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    borderRadius: borderRadius.value,
    overflow: 'hidden',
  }))

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }))

  const toastWrapper: ViewStyle = {
    position: 'absolute',
    top: insets.top + getTopPosition(),
    alignSelf: 'center',
    zIndex: 1000 + index,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[toastWrapper, animatedContainerStyle]}>
        <Animated.View style={animatedIslandStyle}>
          <View
            className={cn(
              'flex-1 gap-6 overflow-hidden rounded-xl bg-primary-foreground shadow-sm shadow-foreground/5',
            )}
          >
            {!isExpanded && (
              <View className="h-full w-full items-center justify-center bg-red-500 p-2">
                {getIcon()}
              </View>
            )}

            {isExpanded && (
              <Animated.View
                className="h-full flex-row items-center px-4 py-3"
                style={animatedContentStyle}
              >
                {getIcon() && <View className="mr-3">{getIcon()}</View>}

                <View className="min-w-0 flex-1">
                  {title && (
                    <Text
                      variant="large"
                      className="font-semibold text-foreground"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {title}
                    </Text>
                  )}

                  {description && (
                    <Text variant="muted" className="mt-1">
                      {description}
                    </Text>
                  )}
                </View>

                {action && (
                  <TouchableOpacity
                    onPress={action.onPress}
                    className={cn('ml-3 rounded-md px-3 py-2', variantBgClass)}
                  >
                    <Text variant="small" className="font-semibold text-white">
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                )}

                <Pressable onPress={dismiss} className="ml-2 rounded">
                  <X size={16} color="#8E8E93" />
                </Pressable>
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  )
}

interface ToastContextType {
  toast: (toast: Omit<ToastData, 'id'>) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
  dismiss: (id: string) => void
  dismissAll: () => void
}

const ToastContext = createContext<ToastContextType | null>(null)

interface ToastProviderProps {
  children: React.ReactNode
  maxToasts?: number
}

export function ToastProvider({ children, maxToasts = 3 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addToast = useCallback(
    (toastData: Omit<ToastData, 'id'>) => {
      const id = generateId()
      const newToast: ToastData = { ...toastData, id, duration: toastData.duration ?? 4000 }

      setToasts((prev) => [newToast, ...prev].slice(0, maxToasts))

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          dismissToast(id)
        }, newToast.duration)
      }
    },
    [maxToasts],
  )

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const dismissAll = useCallback(() => setToasts([]), [])

  const createVariantToast = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      addToast({ title, description, variant })
    },
    [addToast],
  )

  const contextValue: ToastContextType = {
    toast: addToast,
    success: (title, description) => createVariantToast('success', title, description),
    error: (title, description) => createVariantToast('error', title, description),
    warning: (title, description) => createVariantToast('warning', title, description),
    info: (title, description) => createVariantToast('info', title, description),
    dismiss: dismissToast,
    dismissAll,
  }

  const containerStyle: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    pointerEvents: 'box-none',
  }

  return (
    <ToastContext.Provider value={contextValue}>
      <GestureHandlerRootView className="flex-1">
        {children}
        <View style={containerStyle} pointerEvents="box-none">
          {toasts.map((toast, index) => (
            <Toast key={toast.id} {...toast} index={index} onDismiss={dismissToast} />
          ))}
        </View>
      </GestureHandlerRootView>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}
