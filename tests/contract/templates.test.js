import { describe, it, expect } from 'vitest'
import { compile } from '../../src/api/lifescriptApi'
import { templates } from '../../src/templates'
import { useBackend } from '../support/backend'

// Starting on each of the next 7 days covers every start weekday; starting tomorrow means "now" cuts nothing off.
const startDates = Array.from({ length: 7 }, (_, n) => {
  const date = new Date()
  date.setDate(date.getDate() + 1 + n)
  return date
})

describe('templates contract', () => {
  useBackend()

  describe.each(templates)('$title', (template) => {
    it.each(startDates.map(date => [date.toLocaleDateString('en-US', { weekday: 'long' }), date]))(
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
