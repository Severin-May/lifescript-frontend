import { describe, it, expect } from 'vitest'
import { toMarkers } from '../../src/diagnostics'

const diagnostic = (overrides) => ({
  stage: 'VALIDATION',
  severity: 'ERROR',
  message: "Task 'a' depends on 'ghost', which doesn't exist",
  startLineNumber: 3,
  startColumn: 5,
  endLineNumber: 3,
  endColumn: 12,
  ...overrides
})

describe('toMarkers', () => {
  it('uses the diagnostic positions as they are', () => {
    expect(toMarkers([diagnostic()], 8)).toEqual([{
      startLineNumber: 3,
      startColumn: 5,
      endLineNumber: 3,
      endColumn: 12,
      message: "Task 'a' depends on 'ghost', which doesn't exist",
      severity: 8
    }])
  })

  it('skips diagnostics that are not tied to a place', () => {
    const unplaced = diagnostic({ message: 'Plan is empty', startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0 })
    expect(toMarkers([unplaced, diagnostic()], 8)).toHaveLength(1)
  })

  it('returns no markers when there is no output', () => {
    expect(toMarkers(undefined, 8)).toEqual([])
  })
})
