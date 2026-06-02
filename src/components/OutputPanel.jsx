function OutputPanel({ data }) {
  return (
    // <div className='bg-gray-800 p-4 border-t border-gray-700'>
    //   {data.valid ? (
    //     <p className='text-green-400'>✅ Validation successful!</p>
    //   ) : (
    //     <div>
    //       <p className='text-red-400 font-bold mb-2'>❌ Validation errors:</p>
    //       <ul>
    //         {data.errors.map((error, index) => (
    //           <li key={index} className='text-red-300'>
    //             {error}
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   )}
    // </div>
    <div className='bg-gray-800 p-4 border-t border-gray-700 max-h-32 overflow-y-auto'>
      {data.valid ? (
        <p className='text-green-400'>✅ Validation successful!</p>
      ) : (
        <div>
          <p className='text-red-400 font-bold mb-2'>❌ Validation errors:</p>
          <ul>
            {data.errors.map((error, index) => (
              <li key={index} className='text-red-300 text-sm'>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default OutputPanel