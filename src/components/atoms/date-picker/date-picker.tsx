/* eslint-disable no-extra-semi */
/* eslint-disable react-native/no-inline-styles */
import {
  ArrowRight,
  Calendar as CalendarIcon,
  CalendarClock,
  CalendarRange,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { Pressable, TextStyle, View, ViewStyle } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { BottomSheet, useBottomSheet } from 'components/atoms/bottom-sheet'
import { Button } from 'components/atoms/button'
import { Card, CardContent } from 'components/atoms/card'
import { Icon } from 'components/atoms/icon'
import { Text } from 'components/atoms/text'
import { cn } from 'shared/lib/utils'

export interface DateRange {
  startDate: Date | null
  endDate: Date | null
}

interface BaseDatePickerProps {
  label?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  style?: ViewStyle
  minimumDate?: Date
  maximumDate?: Date
  timeFormat?: '12' | '24'
  variant?: 'filled' | 'outline' | 'group'
  labelStyle?: TextStyle
  errorStyle?: TextStyle
  triggerClassName?: string
}

interface DatePickerPropsRange extends BaseDatePickerProps {
  mode: 'range'
  value?: DateRange
  onChange?: (value: DateRange | undefined) => void
}

interface DatePickerPropsDate extends BaseDatePickerProps {
  mode?: 'date' | 'time' | 'datetime'
  value?: Date
  onChange?: (value: Date | undefined) => void
}

export type DatePickerProps = DatePickerPropsRange | DatePickerPropsDate

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 101 }, (_, i) => currentYear - 50 + i)

const isDateRange = (value: Date | DateRange | undefined): value is DateRange =>
  !!value && typeof value === 'object' && 'startDate' in value && 'endDate' in value

export function DatePicker(props: DatePickerProps) {
  const {
    label,
    error,
    placeholder = 'Select date',
    disabled = false,
    style,
    minimumDate,
    maximumDate,
    timeFormat = '24',
    variant = 'filled',
    labelStyle,
    errorStyle,
    triggerClassName,
  } = props

  const mode = props.mode || 'date'
  const value = props.value
  const onChange = props.onChange

  const { isVisible, open, close } = useBottomSheet()

  const getCurrentDate = useCallback(() => {
    if (mode === 'range') {
      const rangeValue = isDateRange(value) ? value : { startDate: null, endDate: null }
      return rangeValue.startDate || new Date()
    }
    return (value as Date) || new Date()
  }, [value, mode])

  const [currentDate, setCurrentDate] = useState(() => getCurrentDate())
  const [viewMode, setViewMode] = useState<'date' | 'time' | 'month' | 'year'>('date')
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [showYearPicker, setShowYearPicker] = useState(false)

  const [tempRange, setTempRange] = useState<DateRange>(() =>
    mode === 'range' && isDateRange(value) ? value : { startDate: null, endDate: null },
  )

  const formatDisplayValue = useCallback(() => {
    if (mode === 'range') {
      const rangeValue = isDateRange(value) ? value : { startDate: null, endDate: null }
      if (!rangeValue.startDate && !rangeValue.endDate) return placeholder
      const startStr = rangeValue.startDate ? rangeValue.startDate.toLocaleDateString() : ''
      const endStr = rangeValue.endDate ? rangeValue.endDate.toLocaleDateString() : ''
      if (startStr && endStr) return `${startStr} - ${endStr}`
      if (startStr) return `${startStr} - Select end date`
      if (endStr) return `Select start date - ${endStr}`
      return placeholder
    }

    const dateValue = value as Date
    if (!dateValue) return placeholder

    switch (mode) {
      case 'time':
        return dateValue.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: timeFormat === '12',
        })
      case 'datetime': {
        const timeStr = dateValue.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: timeFormat === '12',
        })
        return `${dateValue.toLocaleDateString()} ${timeStr}`
      }
      default:
        return dateValue.toLocaleDateString()
    }
  }, [value, mode, placeholder, timeFormat])

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (minimumDate && date < minimumDate) return true
      if (maximumDate && date > maximumDate) return true
      return false
    },
    [minimumDate, maximumDate],
  )

  const isDateInRange = useCallback(
    (date: Date) => {
      if (mode !== 'range' || !tempRange.startDate || !tempRange.endDate) return false
      const startDate = new Date(tempRange.startDate)
      const endDate = new Date(tempRange.endDate)
      const checkDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(0, 0, 0, 0)
      checkDate.setHours(0, 0, 0, 0)
      return checkDate >= startDate && checkDate <= endDate
    },
    [mode, tempRange],
  )

  const isRangeEndpoint = useCallback(
    (date: Date) => {
      if (mode !== 'range') return { isStart: false, isEnd: false }
      const normalizedDate = new Date(date)
      normalizedDate.setHours(0, 0, 0, 0)
      const isStart =
        tempRange.startDate &&
        new Date(tempRange.startDate).setHours(0, 0, 0, 0) === normalizedDate.getTime()
      const isEnd =
        tempRange.endDate &&
        new Date(tempRange.endDate).setHours(0, 0, 0, 0) === normalizedDate.getTime()
      return { isStart: !!isStart, isEnd: !!isEnd }
    },
    [mode, tempRange],
  )

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const weeks: (number | null)[][] = []
    let currentWeek: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) currentWeek.push(null)
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day)
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek])
        currentWeek = []
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null)
      weeks.push(currentWeek)
    }
    return { weeks, year, month, daysInMonth }
  }, [currentDate])

  const handleRangeSelect = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    if (isDateDisabled(selectedDate)) return
    if (!tempRange.startDate || (tempRange.startDate && tempRange.endDate)) {
      setTempRange({ startDate: selectedDate, endDate: null })
    } else {
      const startDate = tempRange.startDate
      if (selectedDate < startDate) {
        setTempRange({ startDate: selectedDate, endDate: null })
      } else {
        setTempRange({ startDate, endDate: selectedDate })
      }
    }
  }

  const handleDateSelect = (day: number) => {
    if (mode === 'range') {
      handleRangeSelect(day)
      return
    }
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    if (isDateDisabled(newDate)) return
    setCurrentDate(newDate)
    if (mode === 'date') {
      ;(onChange as (value: Date | undefined) => void)?.(newDate)
      close()
    } else if (mode === 'datetime') {
      setViewMode('time')
    }
  }

  const handleTimeChange = (hours: number, minutes: number) => {
    const d = new Date(currentDate)
    d.setHours(hours, minutes, 0, 0)
    setCurrentDate(d)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const d = new Date(currentDate)
    if (direction === 'prev') d.setMonth(d.getMonth() - 1)
    else d.setMonth(d.getMonth() + 1)
    setCurrentDate(d)
  }

  const handleMonthSelect = (monthIndex: number) => {
    const d = new Date(currentDate)
    d.setMonth(monthIndex)
    setCurrentDate(d)
    setShowMonthPicker(false)
  }

  const handleYearSelect = (year: number) => {
    const d = new Date(currentDate)
    d.setFullYear(year)
    setCurrentDate(d)
    setShowYearPicker(false)
  }

  const handleConfirm = () => {
    if (mode === 'range') {
      ;(onChange as (value: DateRange | undefined) => void)?.(tempRange)
    } else {
      ;(onChange as (value: Date | undefined) => void)?.(currentDate)
    }
    close()
  }

  const resetToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    if (mode === 'range') {
      setTempRange({ startDate: today, endDate: null })
    } else if (mode === 'date') {
      ;(onChange as (value: Date | undefined) => void)?.(today)
      close()
    }
  }

  const clearSelection = () => {
    if (mode === 'range') {
      setTempRange({ startDate: null, endDate: null })
      ;(onChange as (value: DateRange | undefined) => void)?.(undefined)
    } else {
      ;(onChange as (value: Date | undefined) => void)?.(undefined)
    }
  }

  const renderMonthYearHeader = () => (
    <View className="mb-6 flex-row items-center justify-between px-2">
      <Button className="px-2" variant="secondary" onPress={() => navigateMonth('prev')}>
        <Icon as={ChevronLeft} size={20} className="text-foreground" />
      </Button>

      <View className="mx-3 flex flex-1 flex-row items-center justify-center gap-3">
        <Button className="!flex-1" variant="secondary" onPress={() => setShowMonthPicker(true)}>
          <Text variant="large" className="mr-1">
            {MONTHS[calendarData.month]}
          </Text>
          <Icon as={ChevronDown} size={16} className="text-foreground" />
        </Button>

        <Button className="!flex-1" variant="secondary" onPress={() => setShowYearPicker(true)}>
          <Text variant="large" className="mr-1">
            {calendarData.year}
          </Text>
          <Icon as={ChevronDown} size={16} className="text-foreground" />
        </Button>
      </View>

      <Button className="px-2" variant="secondary" onPress={() => navigateMonth('next')}>
        <Icon as={ChevronRight} size={20} className="text-foreground" />
      </Button>
    </View>
  )

  const renderCalendar = () => (
    <View className="w-full">
      {renderMonthYearHeader()}

      <View className="mb-3 flex-row px-1">
        {DAYS.map((day) => (
          <View key={day} className="flex-1 items-center">
            <Text className="text-xs font-semibold">{day}</Text>
          </View>
        ))}
      </View>

      <View className="px-1">
        {calendarData.weeks.map((week, weekIndex) => (
          <View key={weekIndex} className="mb-1 flex-row">
            {week.map((day, dayIndex) => {
              const dayDate = day ? new Date(calendarData.year, calendarData.month, day) : null

              const isSelected =
                day &&
                value &&
                !isDateRange(value) &&
                value.getDate() === day &&
                value.getMonth() === calendarData.month &&
                value.getFullYear() === calendarData.year

              const isToday =
                day &&
                new Date().getDate() === day &&
                new Date().getMonth() === calendarData.month &&
                new Date().getFullYear() === calendarData.year

              const disabled = dayDate ? isDateDisabled(dayDate) : false
              const inRange = dayDate ? isDateInRange(dayDate) : false
              const rangeEndpoints = dayDate
                ? isRangeEndpoint(dayDate)
                : { isStart: false, isEnd: false }

              return (
                <View
                  key={dayIndex}
                  className={cn(
                    'flex-1 items-center',
                    mode === 'range' && inRange && 'bg-primary/20',
                    rangeEndpoints.isStart && 'rounded-l-md',
                    rangeEndpoints.isEnd && 'rounded-r-md',
                  )}
                >
                  {day ? (
                    <Pressable
                      onPress={() => !disabled && handleDateSelect(day)}
                      disabled={disabled}
                      className={cn(
                        'h-10 w-10 items-center justify-center',
                        (rangeEndpoints.isStart || rangeEndpoints.isEnd) && 'bg-primary',
                        !rangeEndpoints.isStart &&
                          !rangeEndpoints.isEnd &&
                          (inRange || isSelected ? 'bg-primary' : 'bg-transparent'),
                        isToday && !isSelected && !inRange && 'border border-primary',
                        !(rangeEndpoints.isStart || rangeEndpoints.isEnd) && 'rounded-md',
                        disabled && 'opacity-30',
                      )}
                    >
                      <Text
                        className={cn(
                          'text-base',
                          rangeEndpoints.isStart || rangeEndpoints.isEnd
                            ? 'text-primary-foreground'
                            : inRange
                              ? 'text-primary-foreground'
                              : isSelected
                                ? 'text-primary-foreground'
                                : disabled
                                  ? 'text-muted-foreground'
                                  : 'text-foreground',
                          isToday || isSelected || rangeEndpoints.isStart || rangeEndpoints.isEnd
                            ? 'font-semibold'
                            : 'font-normal',
                        )}
                      >
                        {day}
                      </Text>
                    </Pressable>
                  ) : (
                    <View className="h-10 w-10" />
                  )}
                </View>
              )
            })}
          </View>
        ))}
      </View>

      {mode === 'range' && (
        <Card className="mt-4 py-5">
          <CardContent className="flex-row items-center justify-between">
            <Text>
              {tempRange.startDate ? tempRange.startDate.toLocaleDateString() : 'Start date'}
            </Text>

            <Icon as={ArrowRight} size={20} className="text-foreground" strokeWidth={3} />

            <Text>{tempRange.endDate ? tempRange.endDate.toLocaleDateString() : 'End date'}</Text>
          </CardContent>
        </Card>
      )}
    </View>
  )

  const renderTimePicker = () => {
    const selectedHours = currentDate.getHours()
    const selectedMinutes = currentDate.getMinutes()
    const isPM = selectedHours >= 12

    return (
      <View className="h-[300px]">
        <View className="flex-1 flex-row gap-4">
          <View className="flex-1">
            <Text variant="small" className="mb-3 text-center">
              Hours
            </Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 20 }}
            >
              {Array.from({ length: timeFormat === '12' ? 12 : 24 }, (_, i) =>
                timeFormat === '12' ? (i === 0 ? 12 : i) : i,
              ).map((hour) => {
                const actualHour =
                  timeFormat === '12'
                    ? hour === 12
                      ? isPM
                        ? 12
                        : 0
                      : isPM
                        ? hour + 12
                        : hour
                    : hour

                const selected = actualHour === selectedHours

                return (
                  <Button
                    key={hour}
                    onPress={() => handleTimeChange(actualHour, selectedMinutes)}
                    variant={selected ? 'default' : 'ghost'}
                    className="mx-2 my-0.5 h-fit px-4 py-3"
                  >
                    <Text
                      className={cn(
                        'text-base',
                        selected
                          ? 'font-semibold text-primary-foreground'
                          : 'font-normal text-foreground',
                      )}
                    >
                      {hour.toString().padStart(2, '0')}
                    </Text>
                  </Button>
                )
              })}
            </ScrollView>
          </View>

          <View className="flex-1">
            <Text variant="small" className="mb-3 text-center">
              Minutes
            </Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 20 }}
            >
              {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => {
                const selected = minute === selectedMinutes
                return (
                  <Button
                    key={minute}
                    onPress={() => handleTimeChange(selectedHours, minute)}
                    variant={selected ? 'default' : 'ghost'}
                    className="mx-2 my-0.5 h-fit px-4 py-3"
                  >
                    <Text
                      className={cn(
                        'text-base',
                        selected
                          ? 'font-semibold text-primary-foreground'
                          : 'font-normal text-foreground',
                      )}
                    >
                      {minute.toString().padStart(2, '0')}
                    </Text>
                  </Button>
                )
              })}
            </ScrollView>
          </View>

          {timeFormat === '12' && (
            <View className="flex-[0.5]">
              <Text variant="small" className="mb-3 text-center">
                Period
              </Text>
              <View className="gap-2 py-5">
                {(['AM', 'PM'] as const).map((period) => {
                  const isAM = period === 'AM'
                  const selected = isAM ? !isPM : isPM
                  return (
                    <Button
                      key={period}
                      onPress={() => {
                        const newHours = isAM
                          ? selectedHours >= 12
                            ? selectedHours - 12
                            : selectedHours
                          : selectedHours < 12
                            ? selectedHours + 12
                            : selectedHours
                        handleTimeChange(newHours, selectedMinutes)
                      }}
                      variant={selected ? 'default' : 'ghost'}
                      className="my-0.5 h-fit px-4 py-3"
                    >
                      <Text
                        className={cn(
                          'text-base',
                          selected
                            ? 'font-semibold text-primary-foreground'
                            : 'font-normal text-foreground',
                        )}
                      >
                        {period}
                      </Text>
                    </Button>
                  )
                })}
              </View>
            </View>
          )}
        </View>
      </View>
    )
  }

  const renderMonthPicker = () => (
    <View className="h-[300px]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 20 }}
      >
        {MONTHS.map((month, index) => (
          <Button
            key={month}
            onPress={() => handleMonthSelect(index)}
            variant={index === calendarData.month ? 'default' : 'ghost'}
            className="mx-2 my-0.5 h-fit px-4 py-3"
          >
            <Text
              className={cn(
                'text-base',
                index === calendarData.month
                  ? 'font-semibold text-primary-foreground'
                  : 'font-normal text-foreground',
              )}
            >
              {month}
            </Text>
          </Button>
        ))}
      </ScrollView>
    </View>
  )

  const renderYearPicker = () => (
    <View className="h-[300px]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 20 }}
      >
        {YEARS.map((year) => (
          <Button
            key={year}
            variant={year === calendarData.year ? 'default' : 'ghost'}
            onPress={() => handleYearSelect(year)}
            className="mx-2 my-0.5 h-fit px-4 py-3"
          >
            <Text
              className={cn(
                'text-base',
                year === calendarData.year
                  ? 'font-semibold text-primary-foreground'
                  : 'font-normal text-foreground',
              )}
            >
              {year}
            </Text>
          </Button>
        ))}
      </ScrollView>
    </View>
  )

  const getBottomSheetContent = () => {
    if (showMonthPicker) return renderMonthPicker()
    if (showYearPicker) return renderYearPicker()
    if (mode === 'datetime') return viewMode === 'date' ? renderCalendar() : renderTimePicker()
    if (mode === 'time') return renderTimePicker()
    return renderCalendar()
  }

  const getBottomSheetTitle = () => {
    if (showMonthPicker) return 'Select Month'
    if (showYearPicker) return 'Select Year'
    if (mode === 'datetime') return viewMode === 'date' ? 'Select Date' : 'Select Time'
    if (mode === 'time') return 'Select Time'
    if (mode === 'range') return 'Select Range'
    return 'Select Date'
  }

  const triggerBase = cn(
    variant === 'group'
      ? 'min-h-0 border-0 px-0'
      : variant === 'outline'
        ? 'min-h-12 rounded-md border border-border px-4'
        : 'min-h-12 rounded-md border border-card bg-card px-4',
  )

  return (
    <>
      <Pressable
        className={cn(
          'w-full flex-row items-center py-3',
          disabled && 'opacity-50',
          triggerBase,
          triggerClassName,
        )}
        onPress={() => {
          setCurrentDate(new Date())
          setViewMode('date')
          setShowMonthPicker(false)
          setShowYearPicker(false)
          open()
        }}
        disabled={disabled}
        style={style}
      >
        <View className="flex-1 flex-row items-center gap-2">
          <View className="flex-row items-center gap-2" style={{ width: label ? 120 : undefined }}>
            {mode === 'time' ? (
              <Icon as={Clock} size={20} strokeWidth={1} className="text-foreground" />
            ) : mode === 'datetime' ? (
              <Icon as={CalendarClock} size={20} strokeWidth={1} className="text-foreground" />
            ) : mode === 'range' ? (
              <Icon as={CalendarRange} size={20} strokeWidth={1} className="text-foreground" />
            ) : (
              <Icon as={CalendarIcon} size={20} strokeWidth={1} className="text-foreground" />
            )}

            {label && (
              <View className="flex-1">
                <Text
                  variant="small"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className={cn('text-muted-foreground', error && 'text-destructive')}
                  style={labelStyle}
                >
                  {label}
                </Text>
              </View>
            )}
          </View>

          <View className="flex-1">
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className={cn('text-base', value ? 'text-foreground' : 'text-muted-foreground')}
            >
              {formatDisplayValue()}
            </Text>
          </View>
        </View>
      </Pressable>

      {error ? (
        <Text variant="small" className="mt-1 text-destructive" style={errorStyle}>
          {error}
        </Text>
      ) : null}

      <BottomSheet
        isVisible={isVisible}
        onClose={() => {
          close()
          setShowMonthPicker(false)
          setShowYearPicker(false)
        }}
        title={getBottomSheetTitle()}
        snapPoints={[0.65]}
        disablePanGesture={showMonthPicker || showYearPicker}
      >
        <View className="flex-1">
          {getBottomSheetContent()}

          <View className="mt-5 flex-row items-center justify-between gap-3">
            <View className="flex-row gap-2">
              <Button variant="outline" onPress={resetToToday}>
                <Text>Today</Text>
              </Button>

              <Button
                variant="outline"
                onPress={() => {
                  close()
                  setShowMonthPicker(false)
                  setShowYearPicker(false)
                  clearSelection()
                }}
              >
                <Text>{mode === 'range' ? 'Clear' : 'Cancel'}</Text>
              </Button>
            </View>

            {mode === 'datetime' && viewMode === 'date' ? (
              <Button onPress={() => setViewMode('time')} className="flex-1">
                <Text>Next</Text>
              </Button>
            ) : (
              <Button onPress={handleConfirm} className="flex-1">
                <Text>Done</Text>
              </Button>
            )}
          </View>
        </View>
      </BottomSheet>
    </>
  )
}
