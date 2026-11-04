import { describe, it, expect } from 'vitest'
import { hoverDoc, docs } from '../../../src/language/hoverDocs'
import { KEYWORDS, PROPERTIES, VALUES, DAYS } from '../../../src/language/keywords'

describe('hoverDoc', () => {
  it.each([...KEYWORDS, ...PROPERTIES, ...VALUES, ...DAYS])('has a doc for %s', (word) => {
    expect(hoverDoc(word)).not.toBeNull()
  })

  it('points every alias at a real doc', () => {
    const aliases = Object.values(docs).filter(doc => typeof doc === 'string')

    for (const target of aliases) expect(typeof docs[target]).toBe('object')
  })

  it('ignores case', () => {
    expect(hoverDoc('TASK')).toBe(hoverDoc('task'))
  })

  it('gives aliases the doc they point to', () => {
    expect(hoverDoc('tasks')).toBe(hoverDoc('task'))
    expect(hoverDoc('sunday')).toBe(hoverDoc('monday'))
  })

  it('formats title, text and lists as markdown', () => {
    expect(hoverDoc('task')).toBe([
      '**task**',
      'Something to get done; the scheduler finds a time for it.',
      '**Required:** `duration`, `priority`, `effort`',
      '**Optional:** `deadline`, `repeats`, `dependencies`, `note`, `break`'
    ].join('\n\n'))
  })

  it('explains break both in settings and in a task', () => {
    const doc = hoverDoc('break')

    expect(doc).toContain('In `settings`: kept free around everything scheduled')
    expect(doc).toContain("if it isn't set, there are no breaks")
    expect(doc).toContain("In a task: the rest after that task, replacing the plan's break")
    expect(doc).toContain('must fit in free time')
    expect(hoverDoc('settings')).toContain('`break`')
  })

  it('has no doc for names, even ones that are JavaScript object properties', () => {
    expect(hoverDoc('homework')).toBeNull()
    expect(hoverDoc('constructor')).toBeNull()
    expect(hoverDoc('toString')).toBeNull()
  })
})
