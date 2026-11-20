import { describe, it, expect } from 'vitest'
import { suggestionsAt, completionProvider } from '../../../src/language/completion'

const plan = `plan: week
period: 2026-11-20 to 2026-11-26

settings:
    break: 10m

availability:
    monday: morning
energy profile:
    default:
        morning: high
routines:
    routine: gym
        time: 07:00
tasks:
    task: read
        duration: 2h
    task: write
        priority: high
events:
    event: dentist
        date: 2026-11-21`.split('\n')

// Puts `text` (with | as the cursor) on a new line after the line containing `after`.
function typed(after, text, options) {
  const at = plan.findIndex(line => line.includes(after)) + 1
  const lines = [...plan.slice(0, at), text.replace('|', ''), ...plan.slice(at)]
  return suggestionsAt(lines, at + 1, text.indexOf('|') + 1, options)
}

const DAYS_BUT_MONDAY = ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const labels = (result) => result.items.map(item => item.label)

describe('values after a key', () => {
  it('offers priorities and effort levels in a task', () => {
    expect(labels(typed('duration: 2h', '        priority: |'))).toEqual(['critical', 'high', 'medium', 'low'])
    expect(labels(typed('duration: 2h', '        effort: |'))).toEqual(['high', 'moderate', 'low'])
  })

  it('replaces the word being typed', () => {
    const result = typed('duration: 2h', '        priority: hi|')

    expect(result.startColumn).toBe(19)
    expect(result.items[0].insertText).toBe('critical')
  })

  it('adds a space after a bare colon or comma', () => {
    expect(typed('duration: 2h', '        priority:|').items[0].insertText).toBe(' critical')
    expect(typed('time: 07:00', '        repeats: monday,|').items[0].insertText).toBe(' tuesday')
  })

  it('offers day groups and days for repeats, then only the days not listed', () => {
    expect(labels(typed('time: 07:00', '        repeats: |'))).toEqual(
      ['daily', 'weekdays', 'weekends', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    expect(labels(typed('time: 07:00', '        repeats: Monday, wednesday, |'))).toEqual(
      ['tuesday', 'thursday', 'friday', 'saturday', 'sunday'])
    expect(labels(typed('time: 07:00', '        repeats: daily, |'))).toEqual([])
  })

  it('offers the other tasks for dependencies', () => {
    expect(labels(typed('priority: high', '        dependencies: |'))).toEqual(['read'])
    expect(labels(typed('priority: high', '        dependencies: read, |'))).toEqual([])
  })

  it('offers named periods for an event time but nothing for a routine time', () => {
    expect(labels(typed('date: 2026', '        time: |'))).toEqual(['morning', 'afternoon', 'evening'])
    expect(labels(typed('routine: gym', '        time: |'))).toEqual([])
  })

  it('offers flexible or periods for an availability day', () => {
    expect(labels(typed('monday: morning', '    tuesday: |'))).toEqual(['flexible', 'morning', 'afternoon', 'evening'])
    expect(labels(typed('monday: morning', '    tuesday: morning, |'))).toEqual(['afternoon', 'evening'])
  })

  it('offers energy levels in the energy profile', () => {
    expect(labels(typed('morning: high', '        evening: |'))).toEqual(['high', 'moderate', 'low'])
  })

  it('offers nothing for free-form values', () => {
    expect(labels(typed('duration: 2h', '        note: |'))).toEqual([])
    expect(labels(typed('break: 10m', '    morning: |'))).toEqual([])
  })
})

describe('at the start of a line', () => {
  it('offers the missing properties of a task, required ones first', () => {
    const result = typed('duration: 2h', '        |')

    expect(labels(result)).toEqual(['priority', 'effort', 'deadline', 'repeats', 'dependencies', 'note', 'break'])
    expect(result.items[0]).toMatchObject({ detail: 'required', insertText: 'priority: $0', retrigger: true })
    expect(result.items.find(item => item.label === 'note').retrigger).toBe(false)
  })

  it('opens activities on a line of their own', () => {
    const activities = typed('time: 07:00', '        |').items.find(item => item.label === 'activities')

    expect(activities).toMatchObject({ insertText: 'activities:\n    $0', retrigger: false })
  })

  it('offers the missing keys of availability, settings and the energy profile', () => {
    expect(labels(typed('monday: morning', '    |'))).toEqual(DAYS_BUT_MONDAY)
    expect(labels(typed('break: 10m', '    |'))).toEqual(['morning', 'afternoon', 'evening'])
    expect(labels(typed('morning: high', '        |'))).toEqual(['afternoon', 'evening'])
    expect(typed('morning: high', '    |').items.find(item => item.label === 'monday'))
      .toMatchObject({ insertText: 'monday:\n    $0', retrigger: true })
  })

  it('offers only the snippets of the section', () => {
    expect(labels(typed('duration: 2h', '    |'))).toEqual(['task', 'task with deadline', 'task with break'])
    expect(labels(typed('time: 07:00', '    |'))).toEqual(['routine'])
    expect(labels(typed('date: 2026', '    |'))).toEqual(['event'])
  })

  it('offers section snippets on an unindented line', () => {
    expect(labels(typed('date: 2026', '|'))).toContain('energy profile')
    expect(labels(typed('date: 2026', 'ta|'))).toContain('tasks')
  })

  it('opens nothing when a space is typed as indentation', () => {
    expect(typed('duration: 2h', '        |', { byCharacter: true }).items).toEqual([])
    expect(labels(typed('date: 2026', 'energy |', { byCharacter: true }))).toContain('energy profile')
  })
})

describe('completionProvider', () => {
  const monaco = {
    languages: {
      CompletionItemKind: { Value: 'value-kind', Property: 'property-kind' },
      CompletionItemInsertTextRule: { InsertAsSnippet: 'as-snippet' },
      CompletionTriggerKind: { Invoke: 0, TriggerCharacter: 1 }
    }
  }
  const model = (lines) => ({ getLinesContent: () => lines })

  it('turns suggestions into Monaco items with a range and order', () => {
    const lines = ['tasks:', '    task: a', '        priority: h']
    const { suggestions } = completionProvider(monaco).provideCompletionItems(
      model(lines), { lineNumber: 3, column: 20 }, { triggerKind: 0 })

    expect(suggestions[0]).toMatchObject({
      label: 'critical', kind: 'value-kind', insertText: 'critical', sortText: '000',
      range: { startLineNumber: 3, endLineNumber: 3, startColumn: 19, endColumn: 20 }
    })
    expect(suggestions[0].insertTextRules).toBeUndefined()
  })

  it('opens the value list again after a property is picked', () => {
    const lines = ['tasks:', '    task: a', '        ']
    const { suggestions } = completionProvider(monaco).provideCompletionItems(
      model(lines), { lineNumber: 3, column: 9 }, { triggerKind: 0 })

    expect(suggestions[0]).toMatchObject({
      label: 'duration', kind: 'property-kind', insertTextRules: 'as-snippet', detail: 'required'
    })
    expect(suggestions[1].command).toEqual({ id: 'editor.action.triggerSuggest', title: 'Suggest' })
  })
})
