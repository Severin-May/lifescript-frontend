import { useState } from 'react'
import ActivityBar from './ActivityBar'
import ExplorerPanel from './ExplorerPanel'
import CheatSheetPanel from './CheatSheetPanel'
import { FilesIcon, BookIcon } from './icons'

const views = [
  { id: 'explorer', label: 'Explorer', Icon: FilesIcon },
  { id: 'cheatsheet', label: 'Cheat sheet', Icon: BookIcon }
]

function Sidebar({ explorer }) {
  const [activeId, setActiveId] = useState('explorer')
  const toggle = (id) => setActiveId(current => current === id ? null : id)

  const panels = {
    explorer: () => <ExplorerPanel {...explorer} />,
    cheatsheet: () => <CheatSheetPanel />
  }
  const active = views.find(view => view.id === activeId)

  return (
    <div className='flex'>
      <ActivityBar views={views} activeId={activeId} onToggle={toggle} />
      {active && (
        <aside className='w-60 flex flex-col bg-gray-800 border-r border-gray-700 overflow-hidden' aria-label={active.label}>
          <h2 className='px-4 pt-3 pb-1 text-xs uppercase tracking-wide text-gray-400'>{active.label}</h2>
          {panels[active.id]()}
        </aside>
      )}
    </div>
  )
}

export default Sidebar
