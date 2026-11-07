import { addDays, toIsoDate, weekdayName } from '../../src/dates'

// A period can't be in the past, so test plans use tomorrow.
const date = addDays(new Date(), 1)

export const tomorrow = toIsoDate(date)
export const tomorrowWeekday = weekdayName(date)

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

// Applies a backend fix edit (Monaco positions: 1-based, end exclusive) to plain text.
export function applyEdit(plan, edit) {
  const lines = plan.split('\n')
  const offset = (line, column) =>
    lines.slice(0, line - 1).reduce((sum, l) => sum + l.length + 1, 0) + column - 1

  const start = offset(edit.startLineNumber, edit.startColumn)
  const end = offset(edit.endLineNumber, edit.endColumn)
  return plan.slice(0, start) + edit.text + plan.slice(end)
}

// The plan's 10m break after quick_task; deep_work has its own 30m instead.
export const breaksPlan = `plan: breaks
period: ${tomorrow} to ${tomorrow}

settings:
    break: 10m

availability:
    ${tomorrowWeekday}: 09:00-13:00

tasks:
    task: quick_task
        duration: 1h
        priority: critical
        effort: low

    task: deep_work
        duration: 1h
        priority: high
        effort: high
        break: 30m
`

// The task fits in the free hour, but its own break must fit too.
export const breakTooLongPlan = `plan: tight
period: ${tomorrow} to ${tomorrow}

availability:
    ${tomorrowWeekday}: 09:00-10:00

tasks:
    task: tight_task
        duration: 1h
        priority: medium
        effort: low
        break: 30m
`
