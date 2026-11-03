// The reserved words of LifeScript, as in the backend's lexer. Matched in any case.

export const KEYWORDS = [
  'plan', 'period', 'settings', 'availability', 'energy', 'profile', 'default',
  'routines', 'routine', 'activities', 'tasks', 'task', 'events', 'event'
]

export const PROPERTIES = [
  'duration', 'priority', 'effort', 'deadline', 'repeats', 'dependencies', 'note', 'time', 'date'
]

export const VALUES = [
  'high', 'moderate', 'low', 'critical', 'medium',
  'morning', 'afternoon', 'evening', 'flexible',
  'daily', 'weekdays', 'weekends', 'to'
]

export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
