// A period can't be in the past, so test plans use tomorrow.
const date = new Date()
date.setDate(date.getDate() + 1)

export const tomorrow = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  .map(n => String(n).padStart(2, '0')).join('-')
export const tomorrowWeekday = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()

// Only 09:00-11:00 is free: report fits right before its deadline (a warning), big_project fits nowhere.
export const fullPlan = `plan: contract_test
period: ${tomorrow} to ${tomorrow}

availability:
  ${tomorrowWeekday}: 09:00-11:00

routines:
  routine: late_reading
    time: 23:00
    repeats: daily
    activities:
      reading: 1h

tasks:
  task: report
    duration: 2h
    priority: high
    effort: moderate
    deadline: ${tomorrow} 11:00
    note: "final draft"

  task: big_project
    duration: 3h
    priority: low
    effort: low
    note: "needs a whole afternoon"

events:
  event: dentist
    date: ${tomorrow}
    time: 14:00-15:00
    note: "bring insurance card"
`

export const missingDependencyPlan = `plan: broken
period: ${tomorrow} to ${tomorrow}

availability:
  ${tomorrowWeekday}: flexible

tasks:
  task: a
    duration: 1h
    priority: low
    effort: low
    dependencies: ghost
`

export function lineOf(plan, text) {
  return plan.split('\n').findIndex(line => line.includes(text)) + 1
}
