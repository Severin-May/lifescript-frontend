import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import ScheduleView from '../../../src/components/ScheduleView'

const render = (schedule) => renderToStaticMarkup(
  <ScheduleView schedule={{ days: {}, unscheduled: [], warnings: [], ...schedule }} />
)

const entry = (overrides) => ({ type: 'TASK', name: 'research', start: '09:00', end: '11:00', note: null, ...overrides })

describe('ScheduleView', () => {
  // Behind UTC, new Date('2026-11-09') is still Nov 8 locally: the case a naive parse gets wrong.
  let originalTimeZone
  beforeAll(() => {
    originalTimeZone = process.env.TZ
    process.env.TZ = 'America/Los_Angeles'
  })
  afterAll(() => {
    process.env.TZ = originalTimeZone
  })

  it('heads each day with its own date, not the day before', () => {
    const html = render({ days: { '2026-11-09': [entry()] } })

    expect(html).toContain('Monday, Nov 9')
  })

  it('lists days in date order', () => {
    const html = render({ days: { '2026-11-10': [entry({ name: 'second' })], '2026-11-09': [entry({ name: 'first' })] } })

    expect(html.indexOf('first')).toBeLessThan(html.indexOf('second'))
  })

  it('shows an end of 00:00 as 24:00', () => {
    const html = render({ days: { '2026-11-09': [entry({ start: '23:00', end: '00:00' })] } })

    expect(html).toContain('23:00–24:00')
  })

  it('shows the note under its entry', () => {
    const html = render({ days: { '2026-11-09': [entry({ note: 'chapter 2' })] } })

    expect(html).toContain('chapter 2')
  })

  it('says when a day has nothing scheduled', () => {
    const html = render({ days: { '2026-11-09': [] } })

    expect(html).toContain('Monday, Nov 9')
    expect(html).toContain('Nothing scheduled')
  })

  it('says when there are no days at all', () => {
    expect(render({})).toContain('Nothing scheduled')
  })

  it('shows the date of an unscheduled task only when it has one', () => {
    const html = render({
      unscheduled: [
        { name: 'once', date: null, reason: 'no free slot long enough in the period', note: null },
        { name: 'daily_review', date: '2026-11-10', reason: 'no free slot long enough on 2026-11-10', note: null }
      ]
    })

    expect(html).toContain('once</span>: no free slot long enough in the period')
    expect(html).toContain('daily_review</span> (Nov 10): no free slot')
  })

  it('leaves out the warnings and unscheduled sections when they are empty', () => {
    const html = render({ days: { '2026-11-09': [entry()] } })

    expect(html).not.toContain('Warnings')
    expect(html).not.toContain('Could not schedule')
  })
})
