import { useState } from 'react'
import { schedulers, defaultScheduler } from '../schedulers'

const storageKey = 'lifescript.scheduler'

function stored() {
  const id = localStorage.getItem(storageKey)
  return schedulers.some(s => s.id === id) ? id : defaultScheduler
}

export function useScheduler() {
  const [scheduler, setScheduler] = useState(stored)

  const choose = (id) => {
    localStorage.setItem(storageKey, id)
    setScheduler(id)
  }

  return [scheduler, choose]
}
