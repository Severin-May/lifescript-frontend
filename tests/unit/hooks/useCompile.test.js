// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { compile } from '../../../src/api/compilerApi'
import { useCompile } from '../../../src/hooks/useCompile'
import { deferred } from '../../support/deferred'

vi.mock('../../../src/api/compilerApi', () => ({ compile: vi.fn() }))

const schedule = { days: {}, unscheduled: [], warnings: [] }
const resultFor = (content) => ({ valid: true, diagnostics: [], schedule: { ...schedule, content } })

describe('useCompile', () => {
  let response

  beforeEach(() => {
    response = deferred()
    compile.mockReset().mockReturnValue(response.promise)
  })

  const setup = () => renderHook(({ content }) => useCompile(content), { initialProps: { content: 'plan' } })

  it('shows the result and the schedule for the text it was compiled from', async () => {
    const { result } = setup()
    let running
    act(() => { running = result.current.compile(true) })
    await act(async () => { response.resolve(resultFor('plan')); await running })

    expect(result.current.output).toEqual(resultFor('plan'))
    expect(result.current.schedule).toEqual(resultFor('plan').schedule)
    expect(result.current.scheduleOutdated).toBe(false)
  })

  it('does not show a result as current when the text changed while compiling', async () => {
    const { result, rerender } = setup()
    let running
    act(() => { running = result.current.compile(true) })
    act(() => { rerender({ content: 'plan edited' }) })
    await act(async () => { response.resolve(resultFor('plan')); await running })

    expect(result.current.output).toBeNull()
    expect(result.current.scheduleOutdated).toBe(true)
  })

  it('stops showing the result once the text changes', async () => {
    const { result, rerender } = setup()
    await act(async () => { response.resolve(resultFor('plan')); await result.current.compile(true) })

    act(() => { rerender({ content: 'plan edited' }) })

    expect(result.current.output).toBeNull()
    expect(result.current.schedule).not.toBeNull()
    expect(result.current.scheduleOutdated).toBe(true)
  })

  it('opens the schedule only when asked', async () => {
    const { result } = setup()
    await act(async () => { response.resolve(resultFor('plan')); await result.current.compile() })

    expect(result.current.output).not.toBeNull()
    expect(result.current.schedule).toBeNull()
  })

  it('shows a failed compile as an error in the panel', async () => {
    const { result } = setup()
    await act(async () => { response.reject(new Error("Couldn't reach the server")); await result.current.compile(true) })

    expect(result.current.output.diagnostics[0].message).toBe("Compilation failed: Couldn't reach the server")
    expect(result.current.schedule).toBeNull()
  })

  it('closes the schedule', async () => {
    const { result } = setup()
    await act(async () => { response.resolve(resultFor('plan')); await result.current.compile(true) })

    act(() => result.current.closeSchedule())

    expect(result.current.schedule).toBeNull()
  })
})
