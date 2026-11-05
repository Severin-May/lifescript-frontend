import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { request, ApiError } from '../../../src/api/http'

const respond = (status, body) => vi.fn().mockResolvedValue({
  ok: status >= 200 && status < 300,
  status,
  json: () => body === undefined ? Promise.reject(new SyntaxError('no body')) : Promise.resolve(body)
})

describe('request', () => {
  beforeEach(() => vi.stubGlobal('document', { cookie: 'JSESSIONID=x; XSRF-TOKEN=abc%3D123' }))
  afterEach(() => vi.unstubAllGlobals())

  it('sends the CSRF cookie as a header on POST, PUT and DELETE', async () => {
    for (const method of ['POST', 'PUT', 'DELETE']) {
      const fetch = respond(200, {})
      vi.stubGlobal('fetch', fetch)
      await request(method, '/api/plans', {})
      expect(fetch.mock.calls[0][1].headers['X-XSRF-TOKEN']).toBe('abc=123')
    }
  })

  it('sends no CSRF header on GET', async () => {
    const fetch = respond(200, [])
    vi.stubGlobal('fetch', fetch)
    await request('GET', '/api/plans')
    expect(fetch.mock.calls[0][1].headers).toEqual({})
  })

  it('reads the token again on every request', async () => {
    const fetch = respond(200, {})
    vi.stubGlobal('fetch', fetch)
    await request('POST', '/api/auth/login', {})
    document.cookie = 'XSRF-TOKEN=new'
    await request('POST', '/api/plans', {})
    expect(fetch.mock.calls[1][1].headers['X-XSRF-TOKEN']).toBe('new')
  })

  it('sends the body as JSON', async () => {
    const fetch = respond(200, {})
    vi.stubGlobal('fetch', fetch)
    await request('POST', '/api/plans', { name: 'Week' })
    expect(fetch.mock.calls[0][1].headers['Content-Type']).toBe('application/json')
    expect(fetch.mock.calls[0][1].body).toBe('{"name":"Week"}')
  })

  it('returns null for an empty response', async () => {
    vi.stubGlobal('fetch', respond(204))
    expect(await request('DELETE', '/api/plans/1')).toBeNull()
  })

  it('turns a ProblemDetail into an ApiError with its status and detail', async () => {
    vi.stubGlobal('fetch', respond(409, { status: 409, title: 'Conflict', detail: 'Plan 1 was changed since version 0' }))
    const error = await request('PUT', '/api/plans/1', {}).catch(e => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(409)
    expect(error.message).toBe('Plan 1 was changed since version 0')
  })

  it('falls back to the HTTP status when the error has no body', async () => {
    vi.stubGlobal('fetch', respond(403))
    const error = await request('POST', '/api/plans', {}).catch(e => e)
    expect(error.status).toBe(403)
    expect(error.message).toBe('HTTP 403')
  })
})
