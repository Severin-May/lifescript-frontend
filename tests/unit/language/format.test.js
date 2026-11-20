import { describe, it, expect } from 'vitest'
import { formatLines, formattingEdits } from '../../../src/language/format'
import { templates } from '../../../src/templates'

const format = (text) => formatLines(text.split('\n')).join('\n')

describe('formatLines', () => {
  it('leaves every template unchanged', () => {
    for (const template of templates) {
      const text = template.build(new Date())
      expect(format(text)).toBe(text)
    }
  })

  it('puts properties under their entry, whatever their indentation', () => {
    expect(format([
      'tasks:',
      'task: read',
      'duration: 2h',
      '  priority: high',
      '            effort: low'
    ].join('\n'))).toBe([
      'tasks:',
      '    task: read',
      '        duration: 2h',
      '        priority: high',
      '        effort: low'
    ].join('\n'))
  })

  it('turns 2-space indentation into 4 and moves sections back to the margin', () => {
    expect(format([
      '  plan: week',
      'routines:',
      '  Routine: gym',
      '    time: 07:00',
      '    repeats: daily',
      '    activities:',
      '      workout: 1h',
      '      time: 07:00',
      '  events:'
    ].join('\n'))).toBe([
      'plan: week',
      'routines:',
      '    Routine: gym',
      '        time: 07:00',
      '        repeats: daily',
      '        activities:',
      '            workout: 1h',
      '        time: 07:00',
      'events:'
    ].join('\n'))
  })

  it('knows the levels of availability, settings and the energy profile', () => {
    expect(format([
      'settings:',
      'morning: 08:00-12:00',
      '        break: 10m',
      'availability:',
      'monday: flexible',
      'Energy  Profile:',
      'default:',
      'morning: high',
      '  friday:',
      'evening: low'
    ].join('\n'))).toBe([
      'settings:',
      '    morning: 08:00-12:00',
      '    break: 10m',
      'availability:',
      '    monday: flexible',
      'Energy  Profile:',
      '    default:',
      '        morning: high',
      '    friday:',
      '        evening: low'
    ].join('\n'))
  })

  it('keeps unknown lines where they are relative to the line above', () => {
    expect(format([
      'tasks:',
      '  task: read',
      '      priorty: high',
      '      duraton 2h',
      '         odd',
      '  task: write'
    ].join('\n'))).toBe([
      'tasks:',
      '    task: read',
      '        priorty: high',
      '        duraton 2h',
      '            odd',
      '    task: write'
    ].join('\n'))
  })

  it('does not place a property that comes before any entry', () => {
    expect(format('tasks:\n  duration: 2h')).toBe('tasks:\n    duration: 2h')
    expect(format('tasks:\nduration: 2h')).toBe('tasks:\nduration: 2h')
  })

  it('moves full-line comments to the depth of the next line, keeping trailing ones as written', () => {
    expect(format([
      'tasks:',
      '# the first task',
      'task: read    # aligned comment',
      '  # how long',
      'duration: 2h',
      '            # at the end'
    ].join('\n'))).toBe([
      'tasks:',
      '    # the first task',
      '    task: read    # aligned comment',
      '        # how long',
      '        duration: 2h',
      '# at the end'
    ].join('\n'))
  })

  it('empties blank lines and removes trailing spaces', () => {
    expect(format('plan: x   \n    \nperiod: a to b\t')).toBe('plan: x\n\nperiod: a to b')
  })

  it('does not read a # inside a note as a comment', () => {
    expect(format('tasks:\ntask: a\nnote: "#1 priority"')).toBe('tasks:\n    task: a\n        note: "#1 priority"')
  })
})

describe('formattingEdits', () => {
  it('replaces only the lines that change', () => {
    expect(formattingEdits(['tasks:', '    task: a', '  duration: 1h'])).toEqual([{
      range: { startLineNumber: 3, startColumn: 1, endLineNumber: 3, endColumn: 15 },
      text: '        duration: 1h'
    }])
  })

  it('has no edits for a formatted plan', () => {
    expect(formattingEdits(['plan: x', 'tasks:', '    task: a'])).toEqual([])
  })
})
