import { useState, useEffect, useRef } from 'react'
import Editor from './components/Editor'
import Sidebar from './components/sidebar/Sidebar'
import OutputButtons from './components/OutputButtons'
import OutputPanel from './components/OutputPanel'
import ScheduleView from './components/ScheduleView'
import TemplatePicker from './components/TemplatePicker'
import TemplateMenu from './components/TemplateMenu'
import ConfirmDialog from './components/ConfirmDialog'
import AccountButton from './components/AccountButton'
import AuthDialog from './components/AuthDialog'
import SaveDialog from './components/SaveDialog'
import PlanTitle from './components/PlanTitle'
import { validate, clientError } from './api/lifescriptApi'
import { useAuth } from './hooks/useAuth'
import { usePlanList } from './hooks/usePlanList'
import { useSavedPlan } from './hooks/useSavedPlan'
import { useSaveShortcut } from './hooks/useSaveShortcut'
import { useLeaveWarning } from './hooks/useLeaveWarning'

function App() {
  const [content, setContent] = useState('')
  const [syntaxOutput, setSyntaxOutput] = useState(null)
  const [compileOutput, setCompileOutput] = useState(null)
  const [schedule, setSchedule] = useState(null)
  const [scheduleOutdated, setScheduleOutdated] = useState(false)
  const [pendingTemplate, setPendingTemplate] = useState(null)
  const [authMode, setAuthMode] = useState(null)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [pendingDiscard, setPendingDiscard] = useState(null)
  const auth = useAuth()
  const planList = usePlanList(auth.user)
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

  const savedPlan = useSavedPlan(content, handleContentChange, planList.refresh)
  useLeaveWarning(savedPlan.dirty)

  const requestSave = () => {
    if (!auth.user) setAuthMode('login')
    else if (savedPlan.name) savedPlan.save()
    else setSaveDialogOpen(true)
  }
  useSaveShortcut(requestSave)

  const unlessUnsaved = (action) => {
    if (savedPlan.dirty) setPendingDiscard(() => action)
    else action()
  }

  const deletePlan = async (id) => {
    await planList.remove(id)
    if (id === savedPlan.plan?.id) savedPlan.detach()
  }

  const logout = async () => {
    await auth.logout()
    savedPlan.detach()
  }

  const applyTemplate = (template) => {
    handleContentChange(template.build(new Date()))
    setPendingTemplate(null)
    editorRef.current?.focus()
  }

  const pickTemplate = (template) => {
    if (content.trim()) setPendingTemplate(template)
    else applyTemplate(template)
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
      <header className='flex items-center gap-6 p-4'>
        <h1 className='text-2xl font-bold'>LifeScript</h1>
        <TemplateMenu onPick={pickTemplate} />
        <PlanTitle
          name={savedPlan.name}
          dirty={savedPlan.dirty}
          error={savedPlan.error}
          onRename={savedPlan.rename}
          onSave={requestSave}
        />
        <div className='ml-auto'>
          {auth.checked && (
            <AccountButton user={auth.user} onLoginClick={() => setAuthMode('login')} onRegisterClick={() => setAuthMode('register')} onLogout={logout} />
          )}
        </div>
      </header>
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar
          explorer={{
            user: auth.user,
            plans: planList.plans,
            error: planList.error,
            activeId: savedPlan.plan?.id,
            onOpen: (id) => unlessUnsaved(() => savedPlan.open(id)),
            onNew: () => unlessUnsaved(savedPlan.newPlan),
            onDelete: deletePlan,
            onLoginClick: () => setAuthMode('login')
          }}
        />
        <div className='flex flex-col flex-1 overflow-hidden'>
          <div className='flex-1 min-h-0 relative'>
            <Editor content={content} onContentChange={handleContentChange} output={output} editorRef={editorRef} />
            {!content && <TemplatePicker onPick={pickTemplate} />}
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
      <ConfirmDialog
        open={pendingTemplate !== null}
        title='Replace your plan?'
        message={`Your current plan will be replaced with the ${pendingTemplate?.title} template. You can undo this with Ctrl+Z.`}
        confirmLabel='Replace'
        onConfirm={() => applyTemplate(pendingTemplate)}
        onCancel={() => setPendingTemplate(null)}
      />
      <ConfirmDialog
        open={pendingDiscard !== null}
        title='Discard unsaved changes?'
        message="Your changes to this plan haven't been saved and will be lost."
        confirmLabel='Discard'
        onConfirm={() => { pendingDiscard(); setPendingDiscard(null) }}
        onCancel={() => setPendingDiscard(null)}
      />
      <ConfirmDialog
        open={savedPlan.conflict}
        title='Changed elsewhere'
        message={`'${savedPlan.plan?.name}' was saved somewhere else (another tab or device) after you opened it. Reload the saved version? Your changes here will be lost, so copy them first if you need them.`}
        confirmLabel='Reload'
        cancelLabel='Keep my text'
        onConfirm={savedPlan.reload}
        onCancel={savedPlan.dismissConflict}
      />
      {saveDialogOpen && (
        <SaveDialog
          onSave={(name) => { setSaveDialogOpen(false); savedPlan.save(name) }}
          onCancel={() => setSaveDialogOpen(false)}
        />
      )}
      {authMode && (
        <AuthDialog initialMode={authMode} onLogin={auth.login} onRegister={auth.register} onClose={() => setAuthMode(null)} />
      )}
    </div>
  )
}

export default App
