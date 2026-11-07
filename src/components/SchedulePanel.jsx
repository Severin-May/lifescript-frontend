import ScheduleView from './ScheduleView'

function SchedulePanel({ schedule, outdated, onClose }) {
  return (
    <aside className='w-1/3 flex flex-col bg-gray-800 border-l border-gray-700 overflow-hidden'>
      <div className='flex items-center justify-between px-4 py-2 border-b border-gray-700'>
        <h2 className='font-semibold'>Schedule</h2>
        <button onClick={onClose} className='text-gray-400 hover:text-white' aria-label='Close schedule'>✕</button>
      </div>
      {outdated && (
        <p className='px-4 py-2 text-sm bg-gray-700 text-gray-200'>Plan changed: click Calendar to update</p>
      )}
      <div className={`flex-1 overflow-y-auto p-4 ${outdated ? 'opacity-50' : ''}`}>
        <ScheduleView schedule={schedule} />
      </div>
    </aside>
  )
}

export default SchedulePanel
