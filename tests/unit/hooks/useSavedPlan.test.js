import { describe, it, expect } from 'vitest'
import { hasUnsavedChanges } from '../../../src/hooks/useSavedPlan'

const plan = { id: '1', name: 'Week', version: 0 }

describe('hasUnsavedChanges', () => {
  it('is false for an open plan whose text matches what was saved', () => {
    expect(hasUnsavedChanges('period:\n', plan, 'period:\n')).toBe(false)
  })

  it('is true for an open plan whose text was edited', () => {
    expect(hasUnsavedChanges('period:\n    ', plan, 'period:\n')).toBe(true)
  })

  it('is true for a plan saved empty and then typed into', () => {
    expect(hasUnsavedChanges('x', plan, '')).toBe(true)
  })

  it('is true for unsaved text that is not attached to a plan', () => {
    expect(hasUnsavedChanges('period:', null, '')).toBe(true)
  })

  it('is false for an empty or blank editor without a plan', () => {
    expect(hasUnsavedChanges('', null, '')).toBe(false)
    expect(hasUnsavedChanges('  \n', null, '')).toBe(false)
  })
})
