import { useState } from 'react'

const storageKey = 'lifescript.cheatSheet.open'

function stored(groups) {
  const defaults = Object.fromEntries(groups.map(group => [group.id, group.open]))
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(storageKey)) }
  } catch {
    return defaults
  }
}

// Which cheat sheet groups are open, remembered between visits.
export function useOpenGroups(groups) {
  const [open, setOpen] = useState(() => stored(groups))

  const toggle = (id) => {
    const next = { ...open, [id]: !open[id] }
    localStorage.setItem(storageKey, JSON.stringify(next))
    setOpen(next)
  }

  return [open, toggle]
}
