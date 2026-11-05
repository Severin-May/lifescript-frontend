import { useState, useRef } from 'react'

function EditableName({ name, placeholder, onRename }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('')
  const cancelled = useRef(false)

  const start = () => {
    setValue(name ?? '')
    cancelled.current = false
    setEditing(true)
  }

  const finish = () => {
    setEditing(false)
    const trimmed = value.trim()
    if (!cancelled.current && trimmed && trimmed !== name) onRename(trimmed)
  }

  // Enter and Escape blur the input, so every way out goes through finish().
  const handleKey = (e) => {
    if (e.key === 'Escape') cancelled.current = true
    if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget.blur()
  }

  if (editing) {
    return (
      <input
        autoFocus
        maxLength={200}
        value={value}
        aria-label='Plan name'
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        onBlur={finish}
        onFocus={(e) => e.target.select()}
        className='w-56 bg-gray-900 border border-blue-500 rounded px-2 py-1 text-gray-100 focus:outline-none'
      />
    )
  }

  return (
    <button
      onClick={start}
      title='Rename'
      className='truncate text-gray-200 rounded px-2 py-1 border border-transparent hover:border-gray-700 cursor-text'
    >
      {name ?? placeholder}
    </button>
  )
}

export default EditableName
