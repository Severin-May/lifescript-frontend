import { useRef, useEffect } from 'react'

// A native <dialog> shown with showModal() gives the backdrop, focus trapping and Escape-to-cancel for free.
function Modal({ open, onCancel, children }) {
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
      {children}
    </dialog>
  )
}

export default Modal
