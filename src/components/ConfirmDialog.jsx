import Modal from './Modal'

function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel = 'Cancel', onConfirm, onCancel }) {
  return (
    <Modal open={open} onCancel={onCancel}>
      <h2 className='text-lg font-semibold mb-2'>{title}</h2>
      <p className='text-sm text-gray-300 mb-6'>{message}</p>
      <div className='flex justify-end gap-3'>
        <button onClick={onCancel} className='px-4 py-2 rounded text-gray-200 hover:bg-gray-700'>
          {cancelLabel}
        </button>
        <button onClick={onConfirm} className='px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-medium'>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
