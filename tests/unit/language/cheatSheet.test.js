import { describe, it, expect } from 'vitest'
import { cheatSheet } from '../../../src/language/cheatSheet'
import { snippets } from '../../../src/language/snippets'
import { KEYWORDS, PROPERTIES, VALUES, DAYS } from '../../../src/language/keywords'

const words = new Set(cheatSheet
  .flatMap(group => [group.title, ...group.rows.flatMap(row => [row.term, ...row.items])])
  .flatMap(text => text.toLowerCase().match(/\p{L}+/gu) ?? []))

const group = (id) => cheatSheet.find(g => g.id === id)
const row = (id, term) => group(id).rows.find(r => r.term === term)

describe('cheatSheet', () => {
  it.each([...KEYWORDS, ...PROPERTIES, ...VALUES, ...DAYS])('mentions %s', (word) => {
    expect(words).toContain(word)
  })

  it('only refers to snippets that exist', () => {
    const labels = snippets().map(s => s.label)
    const referenced = cheatSheet.flatMap(g => [g.snippet, ...g.rows.map(r => r.snippet)]).filter(Boolean)

    expect(referenced.length).toBeGreaterThan(0)
    for (const label of referenced) expect(labels).toContain(label)
  })

  it('outlines the sections with what goes in them', () => {
    expect(row('outline', 'tasks')).toEqual({ term: 'tasks', items: ['task'], snippet: 'tasks' })
    expect(row('outline', 'energy profile').items).toEqual(['default', 'monday … sunday'])
    expect(row('outline', 'settings').items).toEqual(['morning', 'afternoon', 'evening', 'break'])
  })

  it('lists required and optional properties per entry', () => {
    expect(group('routine').rows).toEqual([{ term: 'required', items: ['time', 'repeats', 'activities'] }])
    expect(row('event', 'optional').items).toEqual(['note'])
  })

  it('takes formats from the hover docs without the repeated key', () => {
    expect(row('formats', 'deadline').items).toEqual(['2026-11-10 17:00'])
    expect(row('outline', 'period').items).toEqual(['YYYY-MM-DD to YYYY-MM-DD'])
  })

  it('has unique group ids', () => {
    expect(new Set(cheatSheet.map(g => g.id)).size).toBe(cheatSheet.length)
  })
})
