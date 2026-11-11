import SchedulerSelect from './SchedulerSelect'

const buttons = [
  { label: 'Calendar', busyLabel: 'Scheduling…', showSchedule: true },
  { label: 'Dashboard', comingSoon: true },
  { label: 'Graph', comingSoon: true },
  { label: 'Export .ics', comingSoon: true }
]

function OutputButtons({ onCompile, running, algorithm, onAlgorithmChange }) {
  return (
    <div className='w-48 bg-gray-800 p-4 flex flex-col gap-3'>
      <SchedulerSelect value={algorithm} onChange={onAlgorithmChange} />
      {buttons.map(({ label, busyLabel, showSchedule, comingSoon }) => (
        <button
          key={label}
          onClick={() => onCompile(showSchedule)}
          disabled={comingSoon || running}
          aria-busy={running && !comingSoon}
          title={comingSoon ? 'Coming soon' : undefined}
          className='flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white p-2 rounded'
        >
          {running && busyLabel ? busyLabel : label}
          {comingSoon && <span className='text-[10px] uppercase tracking-wide bg-gray-600 text-gray-300 rounded px-1'>soon</span>}
        </button>
      ))}
    </div>
  )
}

export default OutputButtons
