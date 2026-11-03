function OutputPanel({ data, onSelect }) {
  if (!data) return null

  return (
    <div className='bg-gray-800 p-4 border-t border-gray-700 max-h-40 overflow-y-auto'>
      {data.valid ? (
        <>
          <p className='text-green-400 font-semibold mb-3'>✅ No errors found</p>
          <p className='text-gray-300 text-sm'>Use buttons above to generate calendar, graph, or export.</p>
        </>
      ) : (
        <>
          <p className='text-red-400 font-semibold mb-3'>❌ Errors found:</p>
          <ul className='text-red-300 text-sm space-y-1'>
            {data.diagnostics?.map((d, i) => {
              const message = d.stage === 'INTERNAL' ? 'There was an internal error' : d.message
              const placed = d.startLineNumber > 0
              return (
                <li
                  key={i}
                  onClick={placed ? () => onSelect(d) : undefined}
                  className={placed ? 'cursor-pointer hover:text-red-100 hover:underline' : ''}
                >
                  {placed ? `Line ${d.startLineNumber}: ${message}` : message}
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}

export default OutputPanel
