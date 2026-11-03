import { useState, useRef, useEffect } from 'react'
import TemplateCards from './TemplateCards'

function TemplateMenu({ onPick }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const closeOnOutsideClick = (e) => {
      if (!menuRef.current.contains(e.target)) setOpen(false)
    }
    const closeOnEscape = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const pick = (template) => {
    setOpen(false)
    onPick(template)
  }

  return (
    <div ref={menuRef} className='relative'>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className='text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded px-3 py-1.5'
      >
        Templates ▾
      </button>
      {open && (
        <div className='absolute left-0 top-full mt-2 w-72 z-20 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-2'>
          <TemplateCards onPick={pick} vertical />
        </div>
      )}
    </div>
  )
}

export default TemplateMenu
