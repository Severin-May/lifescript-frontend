import { compile, clientError } from '../api/lifescriptApi'

function OutputButtons({ content, onOutputReady, onScheduleRequested }) {

    const handleCompile = async (showSchedule = false) => {
        try {
            const result = await compile(content)
            onOutputReady(result)
            if (showSchedule) onScheduleRequested(result)
        } catch (error) {
            onOutputReady(clientError(`Compilation failed: ${error.message}`))
        }
    }

    return (
        <div className='w-48 bg-gray-800 p-4 flex flex-col gap-3'>
            <button onClick={() => handleCompile(true)} className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded'>
                Calendar
            </button>
            <button onClick={() => handleCompile()} className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded'>
                Dashboard
            </button>
            <button onClick={() => handleCompile()} className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded'>
                Graph
            </button>
            <button onClick={() => handleCompile()} className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded'>
                Export .ics
            </button>
        </div>
    )
}

export default OutputButtons
