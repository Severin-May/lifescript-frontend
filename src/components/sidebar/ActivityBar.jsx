function ActivityBar({ views, activeId, onToggle }) {
  return (
    <nav className='w-12 flex flex-col items-center gap-1 py-2 bg-gray-950 border-r border-gray-800' aria-label='Side views'>
      {views.map(({ id, label, Icon }) => {
        const active = id === activeId
        return (
          <button
            key={id}
            onClick={() => onToggle(id)}
            title={label}
            aria-label={label}
            aria-pressed={active}
            className={`w-12 h-12 flex items-center justify-center border-l-2 ${active ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-200'}`}
          >
            <Icon />
          </button>
        )
      })}
    </nav>
  )
}

export default ActivityBar
