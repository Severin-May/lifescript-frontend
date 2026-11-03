import { useRef, useEffect } from 'react'

// A native <dialog> shown with showModal() gives the backdrop, focus trapping and Escape-to-cancel for free.
function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => { e.preventDefault(); onCancel() }}
      className='m-auto w-96 max-w-[calc(100%-2rem)] bg-gray-800 text-white border border-gray-700 rounded-lg shadow-2xl p-6 backdrop:bg-black/60'
    >
      <h2 className='text-lg font-semibold mb-2'>{title}</h2>
      <p className='text-sm text-gray-300 mb-6'>{message}</p>
      <div className='flex justify-end gap-3'>
        <button onClick={onCancel} className='px-4 py-2 rounded text-gray-200 hover:bg-gray-700'>
          Cancel
        </button>
        <button onClick={onConfirm} className='px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-medium'>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}

export default ConfirmDialog
