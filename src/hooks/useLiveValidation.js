import { useState, useEffect } from 'react'
import { validate } from '../api/compilerApi'
import { clientError } from '../diagnostics'

export const VALIDATE_DELAY_MS = 500

export function useLiveValidation(content) {
  const [output, setOutput] = useState(null)

  useEffect(() => {
    if (!content) return
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const result = await validate(content, { signal: controller.signal })
        if (!controller.signal.aborted) setOutput(result)
      } catch (error) {
        if (!controller.signal.aborted) setOutput(clientError(`Validation failed: ${error.message}`))
      }
    }, VALIDATE_DELAY_MS)

    // A newer text makes this run stale: stop its timer and drop its response, even one already on the way.
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [content])

  return content ? output : null
}
