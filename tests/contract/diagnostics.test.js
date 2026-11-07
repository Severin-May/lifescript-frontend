import { describe, it, expect } from 'vitest'
import { validate } from '../../src/api/compilerApi'
import { toMarkers } from '../../src/diagnostics'
import { useBackend } from '../support/backend'
import { fullPlan, missingDependencyPlan, lineOf } from '../support/plans'

describe('diagnostics contract', () => {
  useBackend()

  it('an error becomes a marker on its line', async () => {
    const result = await validate(missingDependencyPlan)
    const line = lineOf(missingDependencyPlan, 'dependencies: ghost')

    expect(result.valid).toBe(false)
    expect(result.schedule).toBeNull()
    expect(toMarkers(result.diagnostics, 8)).toEqual([expect.objectContaining({
      startLineNumber: line,
      endLineNumber: line,
      message: "Task 'a' depends on 'ghost', which doesn't exist"
    })])
  })

  it('a valid plan has no diagnostics and no schedule', async () => {
    const result = await validate(fullPlan)

    expect(result).toEqual({ valid: true, diagnostics: [], schedule: null })
  })
})
