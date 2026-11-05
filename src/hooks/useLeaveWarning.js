import { useEffect } from 'react'

export function useLeaveWarning(active) {
  useEffect(() => {
    if (!active) return
    const warn = (e) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [active])
}
