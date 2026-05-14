function OutputButtons() {
    return (
        <div className='w-48 bg-gray-800 p-4 flex flex-col gap-3'>
            <button className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded'>
                Calendar
            </button>
            <button className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded'>
                Dashboard
            </button>
            <button className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded'>
                Graph
            </button>
            <button className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded'>
                Export .ics
            </button>
        </div>
    )
}

export default OutputButtons