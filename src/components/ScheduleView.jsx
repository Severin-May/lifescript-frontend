const typeStyles = {
  ROUTINE: 'bg-purple-900 text-purple-200',
  EVENT: 'bg-amber-900 text-amber-200',
  TASK: 'bg-blue-900 text-blue-200'
}

// Built from the parts: new Date('YYYY-MM-DD') is UTC midnight and can land on the previous day.
function toDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatDay(iso) {
  return toDate(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

function formatShortDate(iso) {
  return toDate(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// The backend sends "00:00" as the end of an entry that runs until midnight.
function formatEnd(end) {
  return end === '00:00' ? '24:00' : end
}

function ScheduleView({ schedule }) {
  const dates = Object.keys(schedule.days).sort()

  return (
    <div className='text-sm space-y-5'>
      {dates.length === 0 && <p className='text-gray-400'>Nothing scheduled</p>}

      {dates.map(date => (
        <section key={date}>
          <h3 className='font-semibold text-gray-200 mb-2'>{formatDay(date)}</h3>
          <ul className='space-y-1'>
            {schedule.days[date].map((entry, i) => (
              <li key={i}>
                <div className='flex items-center gap-2'>
                  <span className='font-mono text-gray-300 w-24 shrink-0'>
                    {entry.start}–{formatEnd(entry.end)}
                  </span>
                  <span className='text-white truncate'>{entry.name}</span>
                  <span className={`ml-auto text-xs px-1.5 rounded ${typeStyles[entry.type] ?? 'bg-gray-700'}`}>
                    {entry.type.toLowerCase()}
                  </span>
                </div>
                {entry.note && <p className='text-gray-400 pl-26 italic'>{entry.note}</p>}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {schedule.warnings.length > 0 && (
        <section>
          <h3 className='font-semibold text-yellow-400 mb-2'>⚠ Warnings</h3>
          <ul className='space-y-1 text-yellow-200'>
            {schedule.warnings.map((w, i) => (
              <li key={i}>
                <span className='font-medium'>{w.name}</span> ({formatShortDate(w.date)}): {w.message}
              </li>
            ))}
          </ul>
        </section>
      )}

      {schedule.unscheduled.length > 0 && (
        <section>
          <h3 className='font-semibold text-red-400 mb-2'>✖ Could not schedule</h3>
          <ul className='space-y-2 text-red-200'>
            {schedule.unscheduled.map((u, i) => (
              <li key={i}>
                <span className='font-medium'>{u.name}</span>
                {u.date && ` (${formatShortDate(u.date)})`}: {u.reason}
                {u.note && <p className='text-gray-400 italic'>{u.note}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default ScheduleView
