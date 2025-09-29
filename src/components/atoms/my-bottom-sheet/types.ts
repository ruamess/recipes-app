import { ReactNode } from 'react'

export type BottomSheetProps = {
  snapTo: string
  children?: ReactNode
  contentClassName?: string
  indicatorClassName?: string
}

export interface BottomSheetMethods {
  expand: () => void
  close: () => void
}
