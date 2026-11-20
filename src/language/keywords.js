// The reserved words of LifeScript, as in the backend's lexer. Matched in any case.

export const KEYWORDS = [
  'plan', 'period', 'settings', 'availability', 'energy', 'profile', 'default',
  'routines', 'routine', 'activities', 'tasks', 'task', 'events', 'event', 'break'
]

export const PROPERTIES = [
  'duration', 'priority', 'effort', 'deadline', 'repeats', 'dependencies', 'note', 'time', 'date'
]

export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export const PRIORITIES = ['critical', 'high', 'medium', 'low']
export const ENERGY_LEVELS = ['high', 'moderate', 'low']
export const PERIODS = ['morning', 'afternoon', 'evening']
export const DAY_GROUPS = ['daily', 'weekdays', 'weekends']

export const VALUES = [...new Set([
  ...PRIORITIES, ...ENERGY_LEVELS, ...PERIODS, 'flexible', ...DAY_GROUPS, 'to'
])]

export const SECTIONS = ['settings', 'availability', 'energy profile', 'routines', 'tasks', 'events']

export const ENTRY_PROPERTIES = {
  task: { required: ['duration', 'priority', 'effort'], optional: ['deadline', 'repeats', 'dependencies', 'note', 'break'] },
  routine: { required: ['time', 'repeats', 'activities'] },
  event: { required: ['date', 'time'], optional: ['note'] }
}

export const SECTION_KEYS = {
  availability: DAYS,
  settings: [...PERIODS, 'break'],
  'energy profile': ['default', ...DAYS]
}
