import { describe, it, expect, vi, beforeEach } from 'vitest'
import { request, ApiError } from '../../../src/api/http'
import { timeZone } from '../../../src/api/timeZone'
import { validate, compile } from '../../../src/api/compilerApi'

vi.mock('../../../src/api/http', async (original) => ({ ...await original(), request: vi.fn() }))

const result = { valid: true, diagnostics: [], schedule: null }

describe('compilerApi', () => {
  beforeEach(() => { request.mockReset().mockResolvedValue(result) })

  it.each([
    ['validate', validate, '/api/validate'],
    ['compile', compile, '/api/compile']
  ])('%s sends the plan with the time zone and returns the result', async (_, call, path) => {
    expect(await call('period:')).toBe(result)
    expect(request).toHaveBeenCalledWith('POST', path, { content: 'period:', timeZone }, undefined)
  })

  it('passes the abort signal on', async () => {
    const { signal } = new AbortController()
    await validate('period:', { signal })
    expect(request).toHaveBeenCalledWith('POST', '/api/validate', expect.anything(), { signal })
  })

  it('rejects a response without diagnostics', async () => {
    request.mockResolvedValue({ status: 'UP' })
    await expect(validate('period:')).rejects.toThrow('Unexpected response from server')
  })

  it("passes the backend's error on", async () => {
    request.mockRejectedValue(new ApiError(400, 'Unknown time zone: Mars/Base'))
    await expect(compile('period:')).rejects.toThrow('Unknown time zone: Mars/Base')
  })
})
