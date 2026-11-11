import { useState } from 'react'
import { compile } from '../api/compilerApi'
import { clientError } from '../diagnostics'

// Results are kept with the text and algorithm they were compiled with: one that no longer matches
// isn't shown as current, however late it arrives.
export function useCompile(content, algorithm) {
  const [compiled, setCompiled] = useState(null)
  const [schedule, setSchedule] = useState(null)

  const [running, setRunning] = useState(false)

  const run = async (showSchedule = false) => {
    const requested = { content, algorithm }
    setRunning(true)
    let result
    try {
      result = await compile(content, algorithm)
    } catch (error) {
      result = clientError(`Compilation failed: ${error.message}`)
    } finally {
      setRunning(false)
    }
    setCompiled({ ...requested, result })
    if (showSchedule && result.schedule) setSchedule({ ...requested, schedule: result.schedule })
  }

  const isCurrent = entry => entry.content === content && entry.algorithm === algorithm

  return {
    output: compiled && isCurrent(compiled) ? compiled.result : null,
    schedule: schedule?.schedule ?? null,
    scheduleOutdated: schedule !== null && !isCurrent(schedule),
    compile: run,
    running,
    closeSchedule: () => setSchedule(null)
  }
}
