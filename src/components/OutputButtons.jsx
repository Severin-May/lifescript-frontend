import { compile } from '../api/lifescriptApi'

function OutputButtons({ content, onOutputReady }) {

    const handleCompile = async () => {
        const result = await compile(content)
        onOutputReady(result)
    }

    return (
        <div className='w-48 bg-gray-800 p-4 flex flex-col gap-3'>
            <button onClick={handleCompile} className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded'>
                Calendar
            </button>
            <button onClick={handleCompile} className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded'>
                Dashboard
            </button>
            <button onClick={handleCompile} className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded'>
                Graph
            </button>
            <button onClick={handleCompile} className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded'>
                Export .ics
            </button>
        </div>
    )
}

export default OutputButtons