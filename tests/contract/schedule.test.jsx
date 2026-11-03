import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { compile } from '../../src/api/lifescriptApi'
import ScheduleView from '../../src/components/ScheduleView'
import { useBackend } from '../support/backend'
import { fullPlan } from '../support/plans'

describe('schedule contract', () => {
  useBackend()

  it('shows entries, notes, warnings and unscheduled tasks', async () => {
    const result = await compile(fullPlan)
    expect(result.valid).toBe(true)

    const html = renderToStaticMarkup(<ScheduleView schedule={result.schedule} />)

    expect(html).toContain('09:00–11:00')
    expect(html).toContain('report')
    expect(html).toContain('final draft')
    expect(html).toContain('dentist')
    expect(html).toContain('bring insurance card')
    expect(html).toContain('23:00–24:00')
    expect(html).toContain('late_reading')
    expect(html).toContain('ends right at its deadline at 11:00')
    expect(html).toContain('big_project')
    expect(html).toContain('no free slot long enough in the period')
    expect(html).toContain('needs a whole afternoon')
  })
})
