import { describe, it, expect } from 'vitest'
import { validate } from '../../src/api/compilerApi'
import { toMarkers } from '../../src/diagnostics'
import { useBackend } from '../support/backend'
import { fullPlan, missingDependencyPlan, lineOf, applyEdit } from '../support/plans'

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

  it('applying the quick fix makes a misspelled priority valid', async () => {
    const typoPlan = fullPlan.replace('priority: high', 'priority: hgh')

    const before = await validate(typoPlan)
    expect(before.valid).toBe(false)

    const [fix] = before.diagnostics[0].fixes
    const fixed = fix.edits.reduceRight((text, edit) => applyEdit(text, edit), typoPlan)

    expect(fixed).toBe(fullPlan)
    expect(await validate(fixed)).toEqual(expect.objectContaining({ valid: true }))
  })
})
