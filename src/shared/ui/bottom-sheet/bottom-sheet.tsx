import React, { forwardRef, useCallback } from 'react'

import type { BottomSheetBackdropProps, BottomSheetProps } from '@gorhom/bottom-sheet'
import { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import BottomSheet from '@gorhom/bottom-sheet'
import { cssInterop } from 'nativewind'

const BottomSheetBackdropView = cssInterop(BottomSheetBackdrop, { className: 'style' })
const BottomSheetContentView = cssInterop(BottomSheetView, { className: 'style' })

const BottomSheetRoot = cssInterop(BottomSheet, {
  className: 'style',
  backgroundStyle: 'backgroundStyle',
  indicatorStyle: 'handleIndicatorStyle',
})

type MyBottomSheetProps = {
  snapPoints?: BottomSheetProps['snapPoints']
  index?: BottomSheetProps['index']
  onChange?: BottomSheetProps['onChange']
  enablePanDownToClose?: BottomSheetProps['enablePanDownToClose']
  children?: React.ReactNode
  // Tailwind:
  backdropClassName?: string
  contentClassName?: string
  backgroundClassName?: string // алиас для bgStyle
  backgroundStyle?: string // tailwind для backgroundStyle
  indicatorStyle?: string // tailwind для indicatorStyle
} & Omit<
  BottomSheetProps,
  | 'children'
  | 'snapPoints'
  | 'index'
  | 'onChange'
  | 'enablePanDownToClose'
  | 'backdropComponent'
  | 'backgroundComponent'
>

export const MyBottomSheet = forwardRef<BottomSheet, MyBottomSheetProps>(
  (
    {
      snapPoints,
      index = -1,
      onChange,
      enablePanDownToClose = true,
      children,
      backdropClassName = 'bg-foreground/60',
      contentClassName,
      backgroundStyle,
      indicatorStyle,
      ...rest
    },
    ref,
  ) => {
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdropView
          {...props}
          className={backdropClassName}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      [backdropClassName],
    )

    return (
      <BottomSheetRoot
        ref={ref}
        index={index}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        onChange={onChange}
        backdropComponent={renderBackdrop}
        // Tailwind -> backgroundStyle
        backgroundStyle={backgroundStyle}
        indicatorStyle={indicatorStyle}
        {...rest}
      >
        <BottomSheetContentView className={contentClassName}>{children}</BottomSheetContentView>
      </BottomSheetRoot>
    )
  },
)
MyBottomSheet.displayName = 'MyBottomSheet'
