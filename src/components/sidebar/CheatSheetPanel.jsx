import { cheatSheet } from '../../language/cheatSheet'
import { useOpenGroups } from '../../hooks/useOpenGroups'
import CheatGroup from './CheatGroup'

function CheatSheetPanel({ onInsert }) {
  const [open, toggle] = useOpenGroups(cheatSheet)

  return (
    <div className='min-h-0 overflow-y-auto pb-4'>
      {cheatSheet.map(group => (
        <CheatGroup
          key={group.id}
          group={group}
          open={open[group.id]}
          onToggle={() => toggle(group.id)}
          onInsert={onInsert}
        />
      ))}
    </div>
  )
}

export default CheatSheetPanel
