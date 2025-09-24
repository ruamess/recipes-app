import dayjs from 'dayjs'

export function diffDaysFromNow(expire?: string) {
  if (!expire) return undefined
  const d = dayjs(expire)
  if (!d.isValid()) return undefined
  return Math.ceil(d.diff(dayjs(), 'day', true))
}
