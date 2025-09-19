import React, { useMemo } from 'react'
import { View } from 'react-native'
import Svg, { Circle, Text as SvgText } from 'react-native-svg'

import dayjs from 'dayjs'

type Props = {
  expire?: string
  size?: number
  strokeWidth?: number
  maxWindowDays?: number // окно, в котором заполняем до 100%
  showDaysLabel?: boolean
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

function diffDaysFromNow(expire?: string) {
  if (!expire) return undefined
  const d = dayjs(expire)
  if (!d.isValid()) return undefined
  const now = dayjs()
  const diffFloat = d.diff(now, 'day', true)
  return Math.ceil(diffFloat)
}

function statusColor(daysLeft?: number) {
  if (daysLeft === undefined) return '#94a3b8' // нет даты
  if (daysLeft < 0) return '#ef4444' // просрочено
  if (daysLeft <= 1) return '#f43f5e' // очень скоро
  if (daysLeft <= 3) return '#f59e0b' // скоро
  return '#10b981' // ок
}

export const CircularExpiryProgress: React.FC<Props> = ({
  expire,
  size = 40,
  strokeWidth = 4,
  maxWindowDays = 14,
  showDaysLabel = true,
}) => {
  const r = (size - strokeWidth) / 2
  const cx = size / 2
  const cy = size / 2
  const C = 2 * Math.PI * r

  const daysLeft = useMemo(() => diffDaysFromNow(expire), [expire])

  // Обратный прогресс: чем меньше дней осталось, тем больше заполнение
  const urgencyPercent = useMemo(() => {
    if (daysLeft === undefined) return 0 // нет даты — пустой прогресс
    const u = (maxWindowDays - daysLeft) / maxWindowDays // 0..1
    return clamp(u * 100, 0, 100)
  }, [daysLeft, maxWindowDays])

  const trackColor = '#e5e7eb' // gray-200
  const fg = statusColor(daysLeft)
  const dashOffset = C * (1 - urgencyPercent / 100)

  // Против часовой от 12 часов:
  // применяем rotate(-90, cx, cy), затем зеркалим по X вокруг центра
  const arcTransform = `translate(${cx} ${cy}) scale(-1 1) translate(${-cx} ${-cy}) rotate(-90 ${cx} ${cy})`

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={cx} cy={cy} r={r} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={fg}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${C} ${C}`}
          strokeDashoffset={dashOffset}
          fill="none"
          transform={arcTransform}
        />
        {showDaysLabel && size >= 36 && (
          <SvgText x={cx} y={cy + 3} fontSize={size * 0.34} textAnchor="middle" fill="#000000">
            {daysLeft === undefined ? '—' : Math.max(daysLeft, 0)}
          </SvgText>
        )}
      </Svg>
    </View>
  )
}
