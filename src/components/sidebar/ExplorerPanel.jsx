import { useState } from 'react'
import ConfirmDialog from '../ConfirmDialog'

function ExplorerPanel({ user, plans, error, activeId, onOpen, onNew, onDelete, onLoginClick }) {
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  if (!user) {
    return (
      <div className='p-4 text-sm text-gray-400 flex flex-col gap-3'>
        <p>Log in to save your plans and open them later.</p>
        <button onClick={onLoginClick} className='self-start bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1.5'>
          Log in
        </button>
      </div>
    )
  }

  const confirmDelete = async () => {
    const plan = pendingDelete
    setPendingDelete(null)
    try {
      await onDelete(plan.id)
      setDeleteError(null)
    } catch (err) {
      setDeleteError(`Couldn't delete '${plan.name}': ${err.message}`)
    }
  }

  return (
    <div className='flex flex-col min-h-0'>
      <div className='flex items-center justify-between px-4 py-2'>
        <span className='text-xs uppercase tracking-wide text-gray-400'>My plans</span>
        <button onClick={onNew} className='text-sm text-gray-300 hover:text-white' title='New plan'>+ New</button>
      </div>
      {(error || deleteError) && <p role='alert' className='px-4 py-1 text-sm text-red-400'>{error ?? deleteError}</p>}
      {plans.length === 0 && !error && <p className='px-4 py-1 text-sm text-gray-500'>No saved plans yet.</p>}
      <ul className='overflow-y-auto'>
        {plans.map(plan => (
          <li key={plan.id} className={`group flex items-center ${plan.id === activeId ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}>
            <button onClick={() => onOpen(plan.id)} className='flex-1 min-w-0 text-left px-4 py-1.5'>
              <span className='flex items-center gap-2'>
                <span className='truncate text-sm'>{plan.name}</span>
                {!plan.valid && <span className='w-1.5 h-1.5 rounded-full bg-red-400 shrink-0' title='Has errors' />}
              </span>
              <span className='block text-xs text-gray-500'>{new Date(plan.updatedAt).toLocaleString()}</span>
            </button>
            <button
              onClick={() => setPendingDelete(plan)}
              aria-label={`Delete ${plan.name}`}
              className='px-3 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 focus:opacity-100'
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <ConfirmDialog
        open={pendingDelete !== null}
        title='Delete this plan?'
        message={`'${pendingDelete?.name}' and its saved history will be deleted. This can't be undone.`}
        confirmLabel='Delete'
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}

export default ExplorerPanel
