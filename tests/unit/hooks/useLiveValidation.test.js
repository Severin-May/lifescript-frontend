// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { validate } from '../../../src/api/compilerApi'
import { useLiveValidation, VALIDATE_DELAY_MS } from '../../../src/hooks/useLiveValidation'
import { deferred } from '../../support/deferred'

vi.mock('../../../src/api/compilerApi', () => ({ validate: vi.fn() }))

const resultFor = (content) => ({ valid: true, diagnostics: [], schedule: null, content })

describe('useLiveValidation', () => {
  let responses

  beforeEach(() => {
    vi.useFakeTimers()
    responses = {}
    validate.mockReset().mockImplementation((content) => {
      responses[content] = deferred()
      return responses[content].promise
    })
  })

  afterEach(() => vi.useRealTimers())

  // Separate act() calls: the effect that starts the timer only runs once the rerender's act() ends.
  const wait = (ms) => act(() => { vi.advanceTimersByTime(ms) })
  const type = (rerender, content) => {
    act(() => { rerender({ content }) })
    wait(VALIDATE_DELAY_MS)
  }

  const answer = (content, settle = 'resolve', value = resultFor(content)) =>
    act(async () => { responses[content][settle](value) })

  it('validates once typing stops', () => {
    const { rerender } = renderHook(({ content }) => useLiveValidation(content), { initialProps: { content: '' } })
    act(() => { rerender({ content: 'p' }) })
    wait(VALIDATE_DELAY_MS - 1)
    type(rerender, 'pe')
    expect(validate.mock.calls.map(call => call[0])).toEqual(['pe'])
  })

  it('ignores an older response that arrives after a newer one', async () => {
    const { result, rerender } = renderHook(({ content }) => useLiveValidation(content), { initialProps: { content: '' } })
    type(rerender, 'old')
    type(rerender, 'new')

    await answer('new')
    await answer('old')

    expect(result.current).toEqual(resultFor('new'))
  })

  it('aborts the request that is still running when the text changes', () => {
    const { rerender } = renderHook(({ content }) => useLiveValidation(content), { initialProps: { content: '' } })
    type(rerender, 'old')
    const { signal } = validate.mock.calls[0][1]
    expect(signal.aborted).toBe(false)

    act(() => { rerender({ content: 'new' }) })

    expect(signal.aborted).toBe(true)
  })

  it('ignores a failure of a request that is no longer current', async () => {
    const { result, rerender } = renderHook(({ content }) => useLiveValidation(content), { initialProps: { content: '' } })
    type(rerender, 'old')
    type(rerender, 'new')

    await answer('new')
    await answer('old', 'reject', new Error('aborted'))

    expect(result.current).toEqual(resultFor('new'))
  })

  it('shows a failed validation as an error in the panel', async () => {
    const { result, rerender } = renderHook(({ content }) => useLiveValidation(content), { initialProps: { content: '' } })
    type(rerender, 'plan')

    await answer('plan', 'reject', new Error("Couldn't reach the server"))

    expect(result.current.valid).toBe(false)
    expect(result.current.diagnostics[0].message).toBe("Validation failed: Couldn't reach the server")
  })

  it('shows nothing for an empty editor', async () => {
    const { result, rerender } = renderHook(({ content }) => useLiveValidation(content), { initialProps: { content: '' } })
    type(rerender, 'plan')
    await answer('plan')

    act(() => { rerender({ content: '' }) })

    expect(result.current).toBeNull()
  })
})
