import { docs } from './hoverDocs'
import { SHORTCUTS } from './editing'
import {
  SECTIONS, SECTION_KEYS, ENTRY_PROPERTIES, PRIORITIES, ENERGY_LEVELS, PERIODS, DAY_GROUPS, DAYS
} from './keywords'

// The cheat sheet's content, built from the language's own lists so it can't drift from them.
// Group: { id, title, open, snippet?, rows: [{ term, items, snippet? }] }; `snippet` is the label of the
// snippet to insert.

const ALL_DAYS = `${DAYS[0]} … ${DAYS.at(-1)}`

function compactDays(items) {
  if (!DAYS.every(day => items.includes(day))) return items
  const rest = items.filter(item => !DAYS.includes(item))
  return [...rest, ALL_DAYS]
}

// Hover-doc formats without the repeated `key: ` in front.
const formatsOf = (key) => docs[key].format.map(format => format.replace(`${key}: `, ''))

const entryOf = (section) => Object.keys(ENTRY_PROPERTIES).find(kind => `${kind}s` === section)

const outline = {
  id: 'outline',
  title: 'Plan outline',
  open: true,
  rows: [
    { term: 'plan', items: ['name'] },
    { term: 'period', items: formatsOf('period') },
    ...SECTIONS.map(section => ({
      term: section,
      items: SECTION_KEYS[section] ? compactDays(SECTION_KEYS[section]) : [entryOf(section)],
      snippet: section
    }))
  ]
}

const entries = Object.entries(ENTRY_PROPERTIES).map(([kind, { required, optional }]) => ({
  id: kind,
  title: kind,
  open: false,
  snippet: kind,
  rows: [
    { term: 'required', items: required },
    optional && { term: 'optional', items: optional }
  ].filter(Boolean)
}))

const values = {
  id: 'values',
  title: 'Values',
  open: true,
  rows: [
    { term: 'priority', items: PRIORITIES },
    { term: 'effort, energy', items: ENERGY_LEVELS },
    { term: 'repeats', items: [...DAY_GROUPS, 'monday, friday'] },
    { term: 'periods', items: [...PERIODS, 'flexible'] },
    { term: 'days', items: DAYS }
  ]
}

const formats = {
  id: 'formats',
  title: 'Formats',
  open: false,
  rows: [
    { term: 'date', items: formatsOf('date') },
    { term: 'time', items: ['07:00', '09:00-12:00', 'afternoon'] },
    { term: 'duration', items: formatsOf('duration') },
    { term: 'deadline', items: formatsOf('deadline') },
    { term: 'break', items: formatsOf('break') },
    { term: 'note', items: formatsOf('note') }
  ]
}

const shortcuts = {
  id: 'shortcuts',
  title: 'Shortcuts',
  open: true,
  rows: SHORTCUTS.map(({ keys, action }) => ({ term: keys, items: [action] }))
}

export const cheatSheet = [outline, ...entries, values, formats, shortcuts]
