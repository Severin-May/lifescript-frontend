// Calendar dates in the user's local time. new Date('YYYY-MM-DD') would be UTC midnight, which is the
// previous day west of Greenwich, so dates are always built from their parts.

export function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

export function toIsoDate(date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map(part => String(part).padStart(2, '0'))
    .join('-')
}

export function parseIsoDate(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// As LifeScript writes days: 'monday'.
export function weekdayName(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
}
