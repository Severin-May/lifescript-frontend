import { useState } from 'react'
import Modal from './Modal'

function SaveDialog({ onSave, onCancel }) {
  const [name, setName] = useState('')

  const submit = (e) => {
    e.preventDefault()
    onSave(name.trim())
  }

  return (
    <Modal open onCancel={onCancel}>
      <h2 className='text-lg font-semibold mb-4'>Save plan</h2>
      <form onSubmit={submit} className='flex flex-col gap-4'>
        <label className='flex flex-col gap-1 text-sm'>
          Name
          <input
            required
            autoFocus
            maxLength={200}
            pattern='.*\S.*'
            placeholder='e.g. Exam week'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='bg-gray-900 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500'
          />
        </label>
        <div className='flex justify-end gap-3'>
          <button type='button' onClick={onCancel} className='px-4 py-2 rounded text-gray-200 hover:bg-gray-700'>
            Cancel
          </button>
          <button type='submit' className='px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium'>
            Save
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default SaveDialog
