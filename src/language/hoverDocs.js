import { DAYS } from './keywords'

// An entry is either a doc or the name of the entry it shares a doc with.
// Words in `backticks` show as code; lists are shown as code automatically.
export const docs = {
  plan: {
    text: 'The start of every plan: `plan: <name>`, followed by `period`.',
    optional: ['settings', 'availability', 'energy profile', 'routines', 'tasks', 'events']
  },
  period: {
    text: 'The days the plan covers: 1 to 7 days, not in the past.',
    format: ['period: YYYY-MM-DD to YYYY-MM-DD']
  },
  to: {
    text: 'Separates the first and last day in `period`.',
    format: ['period: 2026-11-09 to 2026-11-15']
  },
  settings: {
    text: 'Changes the times of the named periods and sets the plan\'s `break`.',
    format: ['morning: 08:00-12:00', 'break: 10m']
  },
  availability: {
    text: 'When you are free, per day: `flexible`, named periods or time ranges. Days not listed are not available; days outside the period are ignored.',
    format: ['tuesday: 09:00-12:00, 14:00-18:00']
  },
  energy: {
    title: 'energy profile',
    text: 'How much energy you have during the day, so demanding tasks go where your energy is high.',
    example: 'energy profile:\n    default:\n        morning: high\n        evening: low\n    friday:\n        afternoon: low'
  },
  profile: 'energy',
  default: {
    text: "The energy levels for every day. A day's own entries win where they overlap; times nobody covers count as `moderate`."
  },
  routine: {
    text: 'A fixed block of activities that repeats. `time` is when it starts.',
    required: ['time', 'repeats', 'activities']
  },
  routines: 'routine',
  activities: {
    text: 'What the routine consists of, one per line: `name: duration`. The routine lasts as long as they add up to.'
  },
  task: {
    text: 'Something to get done; the scheduler finds a time for it.',
    required: ['duration', 'priority', 'effort'],
    optional: ['deadline', 'repeats', 'dependencies', 'note', 'break']
  },
  tasks: 'task',
  event: {
    text: 'A one-off appointment at a fixed date and time.',
    required: ['date', 'time'],
    optional: ['note']
  },
  events: 'event',
  duration: {
    text: 'How long the task takes: more than 0, at most 24h.',
    format: ['2h', '90m', '1h30m']
  },
  priority: {
    text: 'How important the task is.',
    values: ['critical', 'high', 'medium', 'low']
  },
  effort: {
    text: 'How much energy the task needs; matched against your `energy profile`.',
    values: ['high', 'moderate', 'low']
  },
  deadline: {
    text: 'When the task must be done by: date and time.',
    format: ['deadline: 2026-11-10 17:00']
  },
  repeats: {
    text: 'Which days of the period it happens on.',
    values: ['daily', 'weekdays', 'weekends', 'monday, wednesday']
  },
  dependencies: {
    text: 'Tasks that must be done before this one.',
    format: ['dependencies: research, write_report']
  },
  note: {
    text: 'Your own remark on a task or event, shown with it in the schedule.',
    format: ['note: "bring insurance card"']
  },
  break: {
    text: 'Rest, 0m to 2h. In `settings`: kept free around everything scheduled; if it isn\'t set, there are no breaks. In a task: the rest after that task, replacing the plan\'s break there; unlike the plan\'s, it must fit in free time.',
    format: ['break: 10m', 'break: 1h30m']
  },
  time: {
    text: 'In a routine: the start time, `time: 07:00`. In an event: a time range or named period, `time: 14:00-15:00` or `time: afternoon`.'
  },
  date: {
    text: 'The day of the event.',
    format: ['date: YYYY-MM-DD']
  },
  daily: { text: 'Every day of the period.' },
  weekdays: { text: 'Monday to Friday.' },
  weekends: { text: 'Saturday and Sunday.' },
  flexible: { text: 'Available from the start of `morning` to the end of `evening` (default 06:00-22:00).' },
  morning: { text: 'Named period, default 06:00-12:00. Change it in `settings`.' },
  afternoon: { text: 'Named period, default 12:00-18:00. Change it in `settings`.' },
  evening: { text: 'Named period, default 18:00-22:00. Change it in `settings`.' },
  high: {
    title: 'high / moderate / low',
    text: 'An energy level (in `energy profile`) or how demanding a task is (`effort`). `high` and `low` are also priorities.'
  },
  moderate: 'high',
  low: 'high',
  critical: { text: 'The highest priority.' },
  medium: { text: 'A priority between `high` and `low`.' },
  monday: {
    title: 'monday … sunday',
    text: 'A day of the week, used in `availability`, `repeats` and `energy profile`.'
  },
  ...Object.fromEntries(DAYS.slice(1).map(day => [day, 'monday']))
}

const code = (items) => items.map(item => `\`${item}\``).join(', ')

function toMarkdown(name, doc) {
  return [
    `**${doc.title ?? name}**`,
    doc.text,
    doc.required && `**Required:** ${code(doc.required)}`,
    doc.optional && `**Optional:** ${code(doc.optional)}`,
    doc.values && `**Values:** ${code(doc.values)}`,
    doc.format && `**Format:** ${code(doc.format)}`,
    doc.example && `**Example:**\n\`\`\`\n${doc.example}\n\`\`\``
  ].filter(Boolean).join('\n\n')
}

export function hoverDoc(word) {
  let name = word.toLowerCase()
  if (!Object.hasOwn(docs, name)) return null
  if (typeof docs[name] === 'string') name = docs[name]
  return toMarkdown(name, docs[name])
}
