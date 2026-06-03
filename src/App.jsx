import { useState, useEffect } from 'react'
import Editor from './components/Editor'
import Navigator from './components/Navigator'
import OutputButtons from './components/OutputButtons'
import OutputPanel from './components/OutputPanel'
import { compile } from './api/lifescriptApi'

function App() {
  const [content, setContent] = useState('')
  const [syntaxOutput, setSyntaxOutput] = useState(null)
  const [compileOutput, setCompileOutput] = useState(null)

  useEffect(() => {
    if (!content) {
      setSyntaxOutput(null)
      return
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        })
        const result = await response.json()
        setSyntaxOutput(result)
      } catch (error) {
        setSyntaxOutput({
          valid: false,
          errors: [`Network error: ${error.message}`]
        })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [content])

  const output = compileOutput !== null ? compileOutput : syntaxOutput

  return (
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
        <OutputButtons content={content} onOutputReady={setCompileOutput} />
      </div>
    </div>
  )
}

export default App
