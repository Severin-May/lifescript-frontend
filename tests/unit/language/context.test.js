import { describe, it, expect } from 'vitest'
import { contextAt, taskNames } from '../../../src/language/context'

const plan = `plan: week
period: 2026-11-20 to 2026-11-26

availability:
    monday: morning,
    tuesday:

Energy  Profile:
    default:
        morning:

routines:
    routine: gym
        time: 07:00
        repeats: monday, wed
        activities:
            note: 30m

tasks:
    Task: read   # first
        duration: 2h
        priority:

        effort: high

    task: write
        duration: 1h
        dependencies: read,
        note: "bring # pen"

events:
    event: dentist
        date: 2026-11-21
        time: `.split('\n')

const lineOf = (text) => plan.findLastIndex(line => line.includes(text)) + 1
const endOf = (text) => [lineOf(text), plan[lineOf(text) - 1].length + 1]
const at = (text) => contextAt(plan, ...endOf(text))

describe('contextAt', () => {
  it('finds the section, the enclosing entry and its properties', () => {
    expect(at('priority:')).toEqual({
      section: 'tasks',
      parent: { key: 'task', name: 'read', keys: ['duration', 'priority', 'effort'] },
      key: 'priority',
      listed: []
    })
  })

  it('lists the finished items of a comma list', () => {
    expect(at('repeats:')).toMatchObject({ key: 'repeats', listed: ['monday'] })
    expect(at('dependencies:')).toMatchObject({ key: 'dependencies', listed: ['read'] })
    expect(at('monday: morning')).toMatchObject({ section: 'availability', parent: { key: 'availability' }, key: 'monday', listed: ['morning'] })
  })

  it('reads the block headers of energy profile in any case and spacing', () => {
    expect(at('        morning:')).toMatchObject({ section: 'energy profile', parent: { key: 'default' }, key: 'morning' })
  })

  it('tells an event from a routine', () => {
    expect(at('        time: ')).toMatchObject({ section: 'events', parent: { key: 'event', name: 'dentist' }, key: 'time' })
    expect(at('time: 07:00')).toMatchObject({ section: 'routines', parent: { key: 'routine' } })
  })

  it('counts only direct children as an entry\'s properties', () => {
    expect(at('routine: gym').parent.key).toBe('routines')
    expect(contextAt(plan, lineOf('time: 07:00'), 9).parent.keys).toEqual(['time', 'repeats', 'activities'])
  })

  it('sees activities as their own block', () => {
    expect(at('note: 30m').parent).toMatchObject({ key: 'activities', keys: ['note'] })
  })

  it('skips blank lines and keeps the entry on an empty indented line', () => {
    const blank = lineOf('priority:') + 1
    expect(contextAt([...plan.slice(0, blank - 1), '        ', ...plan.slice(blank)], blank, 9))
      .toMatchObject({ section: 'tasks', parent: { key: 'task', name: 'read' }, key: null })
  })

  it('has no section or entry at the start of a line', () => {
    expect(contextAt(plan, lineOf('priority:'), 1)).toEqual({ section: null, parent: null, key: null, listed: [] })
  })

  it('has no key before the colon', () => {
    expect(contextAt(plan, lineOf('priority:'), 12).key).toBeNull()
  })

  it('ignores comments but not a # inside quotes', () => {
    expect(at('Task: read').parent).toMatchObject({ key: 'tasks' })
    expect(at('note: "bring').key).toBe('note')
  })
})

describe('taskNames', () => {
  it('collects every task name once, without comments', () => {
    expect(taskNames([...plan, '    task: write'])).toEqual(['read', 'write'])
  })
})
