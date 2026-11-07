import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { compile } from '../../src/api/compilerApi'
import ScheduleView from '../../src/components/ScheduleView'
import { useBackend } from '../support/backend'
import { fullPlan, breaksPlan, breakTooLongPlan, tomorrow } from '../support/plans'

const render = (schedule) => renderToStaticMarkup(<ScheduleView schedule={schedule} />)

describe('schedule contract', () => {
  useBackend()

  it('shows entries, notes, warnings and unscheduled tasks', async () => {
    const result = await compile(fullPlan)
    expect(result.valid).toBe(true)

    const html = render(result.schedule)

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
  it('has no breaks when none is set', async () => {
    const result = await compile(fullPlan)

    const types = Object.values(result.schedule.days).flat().map(entry => entry.type)
    expect(types).not.toContain('BREAK')
  })

  it("puts each task's break right after it, with the task's own break replacing the plan's", async () => {
    const result = await compile(breaksPlan)
    expect(result.valid).toBe(true)

    const entries = result.schedule.days[tomorrow]
    const breakAfter = (name) => {
      const at = entries.findIndex(entry => entry.type === 'TASK' && entry.name === name)
      return { task: entries[at], rest: entries[at + 1] }
    }

    const html = render(result.schedule)
    for (const [name, length] of [['quick_task', '10m'], ['deep_work', '30m']]) {
      const { task, rest } = breakAfter(name)
      expect(rest).toMatchObject({ type: 'BREAK', name, note: null, start: task.end })
      expect(html).toContain(`${rest.start}–${rest.end}`)
      expect(html).toContain(`Break · ${length}`)
    }
  })

  it("says when a task doesn't fit with its own break", async () => {
    const result = await compile(breakTooLongPlan)

    expect(result.schedule.unscheduled).toHaveLength(1)
    expect(render(result.schedule)).toContain('no free slot long enough for it and its 30m break')
  })
})
