import { useEffect } from 'react'

// Capture phase, so it runs before Monaco handles the key and the browser's "Save page" dialog is stopped.
export function useSaveShortcut(onSave) {
  useEffect(() => {
    const handle = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        onSave()
      }
    }
    window.addEventListener('keydown', handle, true)
    return () => window.removeEventListener('keydown', handle, true)
  }, [onSave])
}
