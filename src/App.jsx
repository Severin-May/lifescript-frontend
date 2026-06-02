import { useState, useEffect } from 'react'
import Editor from './components/Editor'
import Navigator from './components/Navigator'
import OutputButtons from './components/OutputButtons'
import OutputPanel from './components/OutputPanel'
import { compile } from './api/lifescriptApi'

function App() {
  const [output, setOutput] = useState(null)
  const [content, setContent] = useState('')

  useEffect(() => {
    if (!content) return

    const timer = setTimeout(async () => {
      const result = await compile(content)
      setOutput(result)
    }, 500)

    return () => clearTimeout(timer)
  }, [content])

  return (
    // <div className='flex flex-col h-screen bg-gray-900 text-white'>
    //   <h1 className='text-2xl font-bold p-4'>LifeScript</h1>
    //   <div className='flex flex-1'>
    //     <Navigator />
    //     <Editor content={content} onContentChange={setContent} output={output} />
    //     <OutputButtons content={content} onOutputReady={setOutput} />
    //   </div>
    //   {output && <OutputPanel data={output} />}
    // </div>
    // <div className='flex flex-col h-screen bg-gray-900 text-white overflow-hidden'>
    //   <h1 className='text-2xl font-bold p-4'>LifeScript</h1>
    //   <div className='flex flex-1 overflow-hidden'>
    //     <Navigator />
    //     <Editor content={content} onContentChange={setContent} output={output} />
    //     <OutputButtons content={content} onOutputReady={setOutput} />
    //   </div>
    //   {output && <OutputPanel data={output} />}
    // </div>
    <div className='flex flex-col h-screen bg-gray-900 text-white overflow-hidden'>
      <h1 className='text-2xl font-bold p-4'>LifeScript</h1>
      <div className='flex flex-1 overflow-hidden'>
        <Navigator />
        <div className='flex flex-col flex-1 overflow-hidden'>
          <div className='flex-1 min-h-0'>
            <Editor content={content} onContentChange={setContent} output={output} />
          </div>
          {output && <OutputPanel data={output} />}
        </div>
        <OutputButtons content={content} onOutputReady={setOutput} />
      </div>
    </div>
  )
}

export default App
