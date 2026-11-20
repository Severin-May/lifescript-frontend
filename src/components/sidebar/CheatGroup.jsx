import { tokenType, tokenColors } from '../../language/syntax'

const colorOf = (text) => ({ color: tokenColors[tokenType(text)] })

function InsertButton({ label, onInsert }) {
  return (
    <button
      onClick={() => onInsert(label)}
      title={`Insert ${label}`}
      aria-label={`Insert ${label}`}
      className='px-1 text-gray-500 hover:text-white'
    >
      ⊕
    </button>
  )
}

function CheatGroup({ group, open, onToggle, onInsert }) {
  return (
    <section>
      <div className='flex items-center pr-3 hover:bg-gray-700/50'>
        <button
          onClick={onToggle}
          aria-expanded={open}
          className='flex-1 flex items-center gap-1 pl-4 py-1 text-left text-sm text-gray-200'
        >
          <span aria-hidden='true' className='w-3 text-gray-500'>{open ? '▾' : '▸'}</span>
          {group.title}
        </button>
        {group.snippet && onInsert && <InsertButton label={group.snippet} onInsert={onInsert} />}
      </div>
      {open && (
        <dl className='pl-8 pr-3 pb-2 font-mono text-xs'>
          {group.rows.map(row => (
            <div key={row.term} className='flex gap-2 py-0.5'>
              <dt className='w-24 shrink-0 text-gray-400' style={colorOf(row.term)}>{row.term}</dt>
              <dd className='flex-1 flex flex-wrap gap-x-2 text-gray-300'>
                {row.items.map(item => <span key={item} style={colorOf(item)}>{item}</span>)}
              </dd>
              {row.snippet && onInsert && <InsertButton label={row.snippet} onInsert={onInsert} />}
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}

export default CheatGroup
