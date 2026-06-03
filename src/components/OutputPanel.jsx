function OutputPanel({ data }) {
  if (!data) return null

  return (
    <div className='bg-gray-800 p-4 border-t border-gray-700 max-h-40 overflow-y-auto'>
      {data.valid ? (
        <>
          <p className='text-green-400 font-semibold mb-3'>✅ Syntax is clean !</p>
          <p className='text-gray-300 text-sm'>Use buttons above to generate calendar, graph, or export.</p>
        </>
      ) : (
        <>
          <p className='text-red-400 font-semibold mb-3'>❌ Errors found:</p>
          <ul className='text-red-300 text-sm space-y-1'>
            {data.errors?.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default OutputPanel