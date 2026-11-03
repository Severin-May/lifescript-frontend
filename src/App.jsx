import { useState, useEffect, useRef } from 'react'
import Editor from './components/Editor'
import Navigator from './components/Navigator'
import OutputButtons from './components/OutputButtons'
import OutputPanel from './components/OutputPanel'
import ScheduleView from './components/ScheduleView'
import { validate, clientError } from './api/lifescriptApi'

function App() {
  const [content, setContent] = useState('')
  const [syntaxOutput, setSyntaxOutput] = useState(null)
  const [compileOutput, setCompileOutput] = useState(null)
  const [schedule, setSchedule] = useState(null)
  const [scheduleOutdated, setScheduleOutdated] = useState(false)
  const editorRef = useRef(null)

  useEffect(() => {
    if (!content) return

    const timer = setTimeout(async () => {
      try {
        setSyntaxOutput(await validate(content))
      } catch (error) {
        setSyntaxOutput(clientError(`Validation failed: ${error.message}`))
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [content])

  const output = !content ? null : compileOutput ?? syntaxOutput

  const handleContentChange = (value) => {
    setContent(value)
    setCompileOutput(null)
    setScheduleOutdated(true)
  }

  const showSchedule = (result) => {
    if (!result.schedule) return
    setSchedule(result.schedule)
    setScheduleOutdated(false)
  }

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
            <Editor content={content} onContentChange={handleContentChange} output={output} editorRef={editorRef} />
          </div>
          {output && <OutputPanel data={output} onSelect={jumpTo} />}
        </div>
        {schedule && (
          <aside className='w-1/3 flex flex-col bg-gray-800 border-l border-gray-700 overflow-hidden'>
            <div className='flex items-center justify-between px-4 py-2 border-b border-gray-700'>
              <h2 className='font-semibold'>Schedule</h2>
              <button onClick={() => setSchedule(null)} className='text-gray-400 hover:text-white' aria-label='Close schedule'>✕</button>
            </div>
            {scheduleOutdated && (
              <p className='px-4 py-2 text-sm bg-gray-700 text-gray-200'>Plan changed: click Calendar to update</p>
            )}
            <div className={`flex-1 overflow-y-auto p-4 ${scheduleOutdated ? 'opacity-50' : ''}`}>
              <ScheduleView schedule={schedule} />
            </div>
          </aside>
        )}
        <OutputButtons content={content} onOutputReady={setCompileOutput} onScheduleRequested={showSchedule} />
      </div>
    </div>
  )
}

export default App
