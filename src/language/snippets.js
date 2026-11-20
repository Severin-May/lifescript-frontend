import { DAYS, PRIORITIES, ENERGY_LEVELS, PERIODS, DAY_GROUPS } from './keywords'
import { addDays, toIsoDate } from '../dates'

// Monaco snippet syntax: ${1:default} is a tab stop, ${1|a,b|} a choice (the first is the default), $0 the end.
// Defaults form valid blocks; dates default to tomorrow so they fall inside a period starting today, and
// times avoid the routines and events in the templates.

const choice = (n, values) => `\${${n}|${values.join(',')}|}`
const defaultFirst = (value, values) => [value, ...values.filter(v => v !== value)]

const task = (n) => [
  `task: \${${n}:name}`,
  `    duration: \${${n + 1}:1h}`,
  `    priority: ${choice(n + 2, defaultFirst('medium', PRIORITIES))}`,
  `    effort: ${choice(n + 3, defaultFirst('moderate', ENERGY_LEVELS))}`
]

const routine = (n) => [
  `routine: \${${n}:name}`,
  `    time: \${${n + 1}:06:30}`,
  `    repeats: ${choice(n + 2, [...DAY_GROUPS, ...DAYS])}`,
  '    activities:',
  `        \${${n + 3}:activity}: \${${n + 4}:30m}`
]

const event = (n, date) => [
  `event: \${${n}:name}`,
  `    date: \${${n + 1}:${date}}`,
  `    time: \${${n + 2}:16:00-17:00}`
]

const indent = (lines) => lines.map(line => `    ${line}`)

export function snippets(today = new Date()) {
  const tomorrow = toIsoDate(addDays(today, 1))

  const withDeadline = [...task(1), `    deadline: \${5:${tomorrow}} \${6:17:00}`]
  const withBreak = [...task(1), `    break: \${5:30m}`]

  return [
    { label: 'availability', detail: 'section: when you are free', section: true,
      lines: ['availability:', `    ${choice(1, DAYS)}: \${2:09:00-17:00}`] },
    { label: 'energy profile', detail: 'section: your energy during the day', section: true,
      lines: [
        'energy profile:',
        '    default:',
        `        morning: ${choice(1, ENERGY_LEVELS)}`,
        `        afternoon: ${choice(2, defaultFirst('moderate', ENERGY_LEVELS))}`,
        `        evening: ${choice(3, defaultFirst('low', ENERGY_LEVELS))}`
      ] },
    { label: 'settings', detail: 'section: named periods and the break around everything', section: true,
      lines: ['settings:', `    ${choice(1, PERIODS)}: \${2:08:00-12:00}`, '    break: ${3:10m}'] },
    { label: 'routines', detail: 'section with one routine', section: true, lines: ['routines:', ...indent(routine(1))] },
    { label: 'tasks', detail: 'section with one task', section: true, lines: ['tasks:', ...indent(task(1))] },
    { label: 'events', detail: 'section with one event', section: true, lines: ['events:', ...indent(event(1, tomorrow))] },
    { label: 'routine', in: 'routines', detail: 'a routine with all required properties', lines: routine(1) },
    { label: 'task', in: 'tasks', detail: 'a task with all required properties', lines: task(1) },
    { label: 'task with deadline', in: 'tasks', detail: 'a task that must be done by a date and time', lines: withDeadline },
    { label: 'task with break', in: 'tasks', detail: 'a task with its own rest after it', lines: withBreak },
    { label: 'event', in: 'events', detail: 'a one-off event', lines: event(1, tomorrow) }
  ].map(({ lines, ...snippet }) => ({ ...snippet, body: [...lines, '$0'].join('\n') }))
}
