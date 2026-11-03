import { useState, useEffect, useRef } from 'react'
import Editor from './components/Editor'
import Navigator from './components/Navigator'
import OutputButtons from './components/OutputButtons'
import OutputPanel from './components/OutputPanel'
import { validate, clientError } from './api/lifescriptApi'

function App() {
  const [content, setContent] = useState('')
  const [syntaxOutput, setSyntaxOutput] = useState(null)
  const [compileOutput, setCompileOutput] = useState(null)
  const editorRef = useRef(null)

  useEffect(() => {
    if (!content) {
      setSyntaxOutput(null)
      return
    }

    const timer = setTimeout(async () => {
      try {
        setSyntaxOutput(await validate(content))
      } catch (error) {
        setSyntaxOutput(clientError(`Validation failed: ${error.message}`))
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [content])

  const output = compileOutput !== null ? compileOutput : syntaxOutput

  const jumpTo = (d) => {
    const editor = editorRef.current
    if (!editor) return
    editor.setPosition({ lineNumber: d.startLineNumber, column: d.startColumn })
    editor.revealLineInCenter(d.startLineNumber)
    editor.focus()
  }

  return (
    <div className='flex flex-col h-screen bg-gray-900 text-white overflow-hidden'>
      <h1 className='text-2xl font-bold p-4'>LifeScript</h1>
      <div className='flex flex-1 overflow-hidden'>
        <Navigator />
        <div className='flex flex-col flex-1 overflow-hidden'>
          <div className='flex-1 min-h-0'>
            <Editor content={content} onContentChange={setContent} output={output} editorRef={editorRef} />
          </div>
          {output && <OutputPanel data={output} onSelect={jumpTo} />}
        </div>
        <OutputButtons content={content} onOutputReady={setCompileOutput} />
      </div>
    </div>
  )
}

export default App
