import { describe, it, expect } from 'vitest'
import { compile } from '../../src/api/compilerApi'
import { templates } from '../../src/templates'
import { useBackend } from '../support/backend'
import { addDays, weekdayName } from '../../src/dates'

// Starting on each of the next 7 days covers every start weekday; starting tomorrow means "now" cuts nothing off.
const startDates = Array.from({ length: 7 }, (_, n) => addDays(new Date(), 1 + n))

describe('templates contract', () => {
  useBackend()

  describe.each(templates)('$title', (template) => {
    it.each(startDates.map(date => [weekdayName(date), date]))(
      'compiles and schedules every task when starting on %s',
      async (_, startDate) => {
        const result = await compile(template.build(startDate))

        expect(result.diagnostics).toEqual([])
        expect(result.valid).toBe(true)
        expect(result.schedule.unscheduled).toEqual([])
      }
    )
  })
})
