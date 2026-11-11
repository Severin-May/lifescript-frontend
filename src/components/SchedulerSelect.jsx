import { schedulers } from '../schedulers'

function SchedulerSelect({ value, onChange }) {
  const selected = schedulers.find(s => s.id === value)

  return (
    <label className='flex flex-col gap-1 text-xs text-gray-400'>
      Algorithm
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        title={selected?.description}
        className='bg-gray-700 text-white text-sm rounded p-2 cursor-pointer'
      >
        {schedulers.map(({ id, label, description }) => (
          <option key={id} value={id} title={description}>{label}</option>
        ))}
      </select>
    </label>
  )
}

export default SchedulerSelect
