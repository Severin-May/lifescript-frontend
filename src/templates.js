// Starter plans for the 7 days from today. Events and deadlines sit at fixed day offsets (never today, which
// may be nearly over), and their times avoid every routine, so any start weekday gives a valid plan.

function week(today) {
  const dates = Array.from({ length: 7 }, (_, n) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + n)
    return {
      iso: [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(v => String(v).padStart(2, '0')).join('-'),
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    }
  })
  return { day: n => dates[n].iso, weekday: n => dates[n].weekday }
}

function studentWeek(today) {
  const { day } = week(today)
  return `# A student's week. Change anything; errors show up as you type.
plan: student_week
period: ${day(0)} to ${day(6)}        # at most 7 days, not in the past

settings:
    break: 10m                          # rest around everything scheduled; leave out for none

availability:                           # when tasks may be scheduled
    monday: afternoon, evening          # named periods: morning, afternoon, evening
    tuesday: afternoon, evening
    wednesday: 13:00-21:00              # or exact times
    thursday: afternoon, evening
    friday: afternoon
    saturday: flexible                  # from morning start to evening end
    sunday: 10:00-18:00

energy profile:                         # demanding tasks go where your energy is high
    default:
        morning: high
        afternoon: moderate
        evening: low

routines:                               # fixed blocks that repeat
    routine: gym
        time: 07:00                     # start time
        repeats: monday, wednesday, friday
        activities:
            workout: 1h

    routine: lectures
        time: 09:00
        repeats: weekdays
        activities:                     # the routine lasts as long as these add up to
            lecture: 1h30m
            seminar: 1h30m

tasks:                                  # the scheduler finds a time for these
    task: read_chapter
        duration: 2h
        priority: high
        effort: high
        deadline: ${day(2)} 17:00      # date and time

    task: write_summary
        duration: 1h30m
        priority: medium
        effort: moderate
        deadline: ${day(3)} 20:00
        dependencies: read_chapter      # only after read_chapter is done

    task: exam_prep
        duration: 3h
        priority: critical
        effort: high
        deadline: ${day(4)} 12:00
        note: "past papers"

    task: laundry
        duration: 1h
        priority: low
        effort: low

events:                                 # one-off, at a fixed date and time
    event: exam
        date: ${day(4)}
        time: 14:00-16:00

    event: dinner_with_friends
        date: ${day(5)}
        time: 19:30-21:30
        note: "bring dessert"
`
}

function workWeek(today) {
  const { day } = week(today)
  return `# A work week. Change anything; errors show up as you type.
plan: work_week
period: ${day(0)} to ${day(6)}        # at most 7 days, not in the past

settings:
    break: 10m                          # rest around everything scheduled; leave out for none

availability:                           # when tasks may be scheduled
    monday: 09:00-17:00
    tuesday: 09:00-17:00
    wednesday: 09:00-17:00
    thursday: 09:00-17:00
    friday: 09:00-17:00
    saturday: morning                   # sunday isn't listed, so nothing is scheduled then

energy profile:                         # demanding tasks go where your energy is high
    default:
        morning: high
        afternoon: moderate
    friday:                             # a day's own entries win over default
        afternoon: low

routines:                               # fixed blocks that repeat
    routine: standup
        time: 09:30                     # start time
        repeats: weekdays
        activities:
            standup: 15m

    routine: lunch
        time: 12:00
        repeats: daily
        activities:
            lunch: 45m

tasks:                                  # the scheduler finds a time for these
    task: prepare_slides
        duration: 2h
        priority: high
        effort: moderate
        deadline: ${day(3)} 14:00      # date and time

    task: follow_up_email
        duration: 30m
        priority: medium
        effort: low
        dependencies: prepare_slides    # only after prepare_slides is done

    task: quarterly_report
        duration: 3h
        priority: critical
        effort: high
        deadline: ${day(4)} 17:00
        note: "numbers from finance"

    task: review_pull_requests
        duration: 1h
        priority: medium
        effort: moderate
        repeats: weekdays               # repeating tasks can't have a deadline

    task: tidy_desk
        duration: 20m
        priority: low
        effort: low

events:                                 # one-off, at a fixed date and time
    event: team_meeting
        date: ${day(2)}
        time: 10:00-11:00

    event: client_call
        date: ${day(3)}
        time: 15:00-16:00
        note: "share the slides"

    event: dentist
        date: ${day(5)}
        time: 08:00-08:30
`
}

function minimal(today) {
  const { day, weekday } = week(today)
  return `plan: my_week
period: ${day(0)} to ${day(6)}

availability:
    ${weekday(1)}: flexible                 # add a line for each day you're free

tasks:
    task: first_task
        duration: 1h
        priority: medium
        effort: moderate
`
}

export const templates = [
  { id: 'student', icon: '🎓', title: 'Student week', description: 'Lectures, study tasks with deadlines, an exam', build: studentWeek },
  { id: 'work', icon: '💼', title: 'Work week', description: 'Standups, meetings, tasks with priorities', build: workWeek },
  { id: 'minimal', icon: '✏️', title: 'Minimal', description: 'One free day and one task, nothing else', build: minimal }
]
