import { useState, useRef } from 'react'
import { getPlan, createPlan, updatePlan } from '../api/plansApi'
import { ApiError } from '../api/http'

export function hasUnsavedChanges(content, plan, savedContent) {
  return plan ? content !== savedContent : content.trim() !== ''
}

const summary = ({ id, name, version }) => ({ id, name, version })

export function useSavedPlan(content, onLoad, onSaved) {
  const [plan, setPlan] = useState(null)
  const [savedContent, setSavedContent] = useState('')
  const [draftName, setDraftName] = useState(null)
  const [conflict, setConflict] = useState(false)
  const [error, setError] = useState(null)
  const busy = useRef(false)

  const load = (loaded) => {
    setPlan(loaded ? summary(loaded) : null)
    setSavedContent(loaded?.content ?? '')
    setDraftName(null)
    setConflict(false)
    setError(null)
    onLoad(loaded?.content ?? '')
  }

  const open = async (id) => {
    try {
      load(await getPlan(id))
    } catch (err) {
      setError(`Couldn't open the plan: ${err.message}`)
    }
  }

  const write = async (name, text, action) => {
    if (busy.current) return
    busy.current = true
    try {
      const saved = plan
        ? await updatePlan(plan.id, { name, content: text, version: plan.version })
        : await createPlan(name, text)
      setPlan(summary(saved))
      setSavedContent(text)
      setDraftName(null)
      setError(null)
      onSaved()
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) setConflict(true)
      else setError(`Couldn't ${action}: ${err.message}`)
    } finally {
      busy.current = false
    }
  }

  const name = plan?.name ?? draftName

  const save = (newName) => write(newName ?? name, content, 'save')

  // Sends the last saved text, so renaming doesn't also save unsaved edits.
  const rename = (newName) => plan ? write(newName, savedContent, 'rename') : setDraftName(newName)

  return {
    plan,
    name,
    dirty: hasUnsavedChanges(content, plan, savedContent),
    conflict,
    error,
    open,
    save,
    rename,
    newPlan: () => load(null),
    reload: () => open(plan.id),
    dismissConflict: () => setConflict(false),
    detach: () => { setPlan(null); setSavedContent(''); setDraftName(null) }
  }
}
