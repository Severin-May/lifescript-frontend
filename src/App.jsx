import { useState, useRef } from 'react'
import Editor from './components/Editor'
import Sidebar from './components/sidebar/Sidebar'
import OutputButtons from './components/OutputButtons'
import OutputPanel from './components/OutputPanel'
import SchedulePanel from './components/SchedulePanel'
import TemplatePicker from './components/TemplatePicker'
import TemplateMenu from './components/TemplateMenu'
import ConfirmDialog from './components/ConfirmDialog'
import AccountButton from './components/AccountButton'
import AuthDialog from './components/AuthDialog'
import SaveDialog from './components/SaveDialog'
import PlanTitle from './components/PlanTitle'
import { useAuth } from './hooks/useAuth'
import { usePlanList } from './hooks/usePlanList'
import { useSavedPlan } from './hooks/useSavedPlan'
import { useSaveShortcut } from './hooks/useSaveShortcut'
import { useLeaveWarning } from './hooks/useLeaveWarning'
import { useLiveValidation } from './hooks/useLiveValidation'
import { useCompile } from './hooks/useCompile'

function App() {
  const [content, setContent] = useState('')
  const [pendingTemplate, setPendingTemplate] = useState(null)
  const [authMode, setAuthMode] = useState(null)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [pendingDiscard, setPendingDiscard] = useState(null)
  const auth = useAuth()
  const planList = usePlanList(auth.user)
  const editorRef = useRef(null)

  const validation = useLiveValidation(content)
  const compiler = useCompile(content)
  const output = !content ? null : compiler.output ?? validation


  const savedPlan = useSavedPlan(content, setContent, planList.refresh)
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
    setContent(template.build(new Date()))
    setPendingTemplate(null)
    editorRef.current?.focus()
  }

  const pickTemplate = (template) => {
    if (content.trim()) setPendingTemplate(template)
    else applyTemplate(template)
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
            <Editor content={content} onContentChange={setContent} output={output} editorRef={editorRef} />
            {!content && <TemplatePicker onPick={pickTemplate} />}
          </div>
          {output && <OutputPanel data={output} onSelect={jumpTo} />}
        </div>
        {compiler.schedule && (
          <SchedulePanel schedule={compiler.schedule} outdated={compiler.scheduleOutdated} onClose={compiler.closeSchedule} />
        )}
        <OutputButtons onCompile={compiler.compile} />
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
