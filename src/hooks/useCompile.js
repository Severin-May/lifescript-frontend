import { useState } from 'react'
import { compile } from '../api/compilerApi'
import { clientError } from '../diagnostics'

// Results are kept with the text they were compiled from: one that no longer matches the editor
// isn't shown as current, however late it arrives.
export function useCompile(content) {
  const [compiled, setCompiled] = useState(null)
  const [schedule, setSchedule] = useState(null)

  const run = async (showSchedule = false) => {
    const requested = content
    let result
    try {
      result = await compile(requested)
    } catch (error) {
      result = clientError(`Compilation failed: ${error.message}`)
    }
    setCompiled({ content: requested, result })
    if (showSchedule && result.schedule) setSchedule({ content: requested, schedule: result.schedule })
  }

  return {
    output: compiled?.content === content ? compiled.result : null,
    schedule: schedule?.schedule ?? null,
    scheduleOutdated: schedule !== null && schedule.content !== content,
    compile: run,
    closeSchedule: () => setSchedule(null)
  }
}
