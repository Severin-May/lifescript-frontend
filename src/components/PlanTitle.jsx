import EditableName from './EditableName'

function PlanTitle({ name, dirty, error, onRename, onSave }) {
  return (
    <div className='flex items-center gap-3 text-sm min-w-0'>
      <span className='flex items-center min-w-0'>
        <EditableName name={name} placeholder='Untitled' onRename={onRename} />
        {dirty && <span className='text-gray-400' title='Unsaved changes' aria-label='unsaved changes'>●</span>}
      </span>
      <button
        onClick={onSave}
        title='Save (Ctrl+S)'
        className='bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded px-3 py-1.5'
      >
        Save
      </button>
      {error && <span role='alert' className='text-red-400 truncate'>{error}</span>}
    </div>
  )
}

export default PlanTitle
