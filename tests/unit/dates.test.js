import { describe, it, expect } from 'vitest'
import { addDays, toIsoDate, parseIsoDate, weekdayName } from '../../src/dates'

describe('dates', () => {
  it('formats a date as YYYY-MM-DD with zero padding', () => {
    expect(toIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('adds days across the end of a month and a year', () => {
    expect(toIsoDate(addDays(new Date(2026, 0, 31), 1))).toBe('2026-02-01')
    expect(toIsoDate(addDays(new Date(2026, 11, 30), 3))).toBe('2027-01-02')
  })

  it('adds days across a daylight saving change without skipping or repeating a day', () => {
    const days = Array.from({ length: 4 }, (_, n) => toIsoDate(addDays(new Date(2026, 2, 28), n)))
    expect(days).toEqual(['2026-03-28', '2026-03-29', '2026-03-30', '2026-03-31'])
  })

  it('drops the time of day', () => {
    const date = addDays(new Date(2026, 10, 5, 23, 59), 0)
    expect([date.getHours(), date.getMinutes()]).toEqual([0, 0])
  })

  it('parses YYYY-MM-DD as that day in local time', () => {
    const date = parseIsoDate('2026-11-10')
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2026, 10, 10])
    expect(toIsoDate(parseIsoDate('2026-02-01'))).toBe('2026-02-01')
  })

  it('names the weekday the way LifeScript writes it', () => {
    expect(weekdayName(new Date(2026, 10, 9))).toBe('monday')
    expect(weekdayName(new Date(2026, 10, 15))).toBe('sunday')
  })
})
