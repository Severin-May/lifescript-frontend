import { useState } from 'react'
import Editor from './components/Editor'
import Navigator from './components/Navigator'
import OutputButtons from './components/OutputButtons'
import OutputPanel from './components/OutputPanel'

function App() {
  const [output, setOutput] = useState(null)
  const [content, setContent] = useState('')

  return (
    <div className='flex flex-col h-screen bg-gray-900 text-white'>
      <h1 className='text-2xl font-bold p-4'>LifeScript</h1>
      <div className='flex flex-1'>
        <Navigator />
        <Editor content={content} onContentChange={setContent} />
        <OutputButtons content={content} />
      </div>
      {output && <OutputPanel data={output} />}
    </div>
  )
}

export default App
