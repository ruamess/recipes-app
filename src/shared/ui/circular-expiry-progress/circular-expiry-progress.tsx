import React, { useMemo } from 'react'
import { View } from 'react-native'
import Svg, { Circle, Text as SvgText } from 'react-native-svg'

import { diffDaysFromNow } from 'entities/product/model/expiry'

type Props = {
  expire?: string
  size?: number
  strokeWidth?: number
  maxWindowDays?: number
  showDaysLabel?: boolean
  minVisiblePercent?: number
  trackColorClassName?: string
  className?: string
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

function pickColor(daysLeft?: number) {
  if (daysLeft === undefined) return '#94a3b8' // slate-400
  if (daysLeft < 0) return '#ef4444' // red-500
  if (daysLeft <= 1) return '#f43f5e' // rose-500
  if (daysLeft <= 3) return '#f59e0b' // amber-500
  return '#10b981' // emerald-500
}

export const CircularExpiryProgress: React.FC<Props> = ({
  expire,
  size = 40,
  strokeWidth = 4,
  maxWindowDays = 14,
  showDaysLabel = true,
  minVisiblePercent = 5,
  className,
}) => {
  const r = (size - strokeWidth) / 2
  const cx = size / 2
  const cy = size / 2
  const C = 2 * Math.PI * r

  const daysLeft = useMemo(() => diffDaysFromNow(expire), [expire])

  const percent = useMemo(() => {
    if (daysLeft === undefined) return 0
    if (daysLeft < 0) return 100
    const raw = (maxWindowDays - daysLeft) / maxWindowDays
    const norm = clamp(raw, 0, 1)
    const base = clamp(minVisiblePercent, 0, 30)
    return base + norm * (100 - base)
  }, [daysLeft, maxWindowDays, minVisiblePercent])

  const strokeColor = pickColor(daysLeft)
  const dashOffset = C * (1 - percent / 100)
  const arcTransform = `translate(${cx} ${cy}) scale(-1 1) translate(${-cx} ${-cy}) rotate(-90 ${cx} ${cy})`

  const trackColor = '#e5e7eb'

  return (
    <View
      className={['items-center justify-center', className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
      accessibilityLabel={
        daysLeft === undefined ? 'No expiry' : daysLeft < 0 ? 'Expired' : `${daysLeft} days left`
      }
    >
      <Svg width={size} height={size}>
        <Circle cx={cx} cy={cy} r={r} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${C} ${C}`}
          strokeDashoffset={dashOffset}
          fill="none"
          transform={arcTransform}
        />
        {showDaysLabel && size >= 36 && (
          <SvgText x={cx} y={cy + 3} fontSize={size * 0.34} textAnchor="middle" fill="#0f172a">
            {daysLeft === undefined ? '—' : Math.max(daysLeft, 0)}
          </SvgText>
        )}
      </Svg>
    </View>
  )
}
