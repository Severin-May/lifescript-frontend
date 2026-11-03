import { DAYS } from './keywords'

// Monaco snippet syntax: ${1:default} is a tab stop, ${1|a,b|} a choice (the first is the default), $0 the end.
// Defaults form valid blocks; dates default to tomorrow so they fall inside a period starting today, and
// times avoid the routines and events in the templates.

const choice = (n, values) => `\${${n}|${values.join(',')}|}`

const task = (n) => [
  `task: \${${n}:name}`,
  `    duration: \${${n + 1}:1h}`,
  `    priority: ${choice(n + 2, ['medium', 'critical', 'high', 'low'])}`,
  `    effort: ${choice(n + 3, ['moderate', 'high', 'low'])}`
]

const routine = (n) => [
  `routine: \${${n}:name}`,
  `    time: \${${n + 1}:06:30}`,
  `    repeats: ${choice(n + 2, ['daily', 'weekdays', 'weekends', ...DAYS])}`,
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
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  const tomorrow = [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(v => String(v).padStart(2, '0')).join('-')

  const withDeadline = [...task(1), `    deadline: \${5:${tomorrow}} \${6:17:00}`]

  return [
    { label: 'availability', detail: 'section: when you are free', section: true,
      lines: ['availability:', `    ${choice(1, DAYS)}: \${2:09:00-17:00}`] },
    { label: 'energy profile', detail: 'section: your energy during the day', section: true,
      lines: [
        'energy profile:',
        '    default:',
        `        morning: ${choice(1, ['high', 'moderate', 'low'])}`,
        `        afternoon: ${choice(2, ['moderate', 'high', 'low'])}`,
        `        evening: ${choice(3, ['low', 'high', 'moderate'])}`
      ] },
    { label: 'settings', detail: 'section: change morning, afternoon, evening', section: true,
      lines: ['settings:', `    ${choice(1, ['morning', 'afternoon', 'evening'])}:\${2:08:00-12:00}`] },
    { label: 'routines', detail: 'section with one routine', section: true, lines: ['routines:', ...indent(routine(1))] },
    { label: 'tasks', detail: 'section with one task', section: true, lines: ['tasks:', ...indent(task(1))] },
    { label: 'events', detail: 'section with one event', section: true, lines: ['events:', ...indent(event(1, tomorrow))] },
    { label: 'routine', detail: 'a routine with all required properties', lines: routine(1) },
    { label: 'task', detail: 'a task with all required properties', lines: task(1) },
    { label: 'task with deadline', detail: 'a task that must be done by a date and time', lines: withDeadline },
    { label: 'event', detail: 'a one-off event', lines: event(1, tomorrow) }
  ].map(({ lines, ...snippet }) => ({ ...snippet, body: [...lines, '$0'].join('\n') }))
}
