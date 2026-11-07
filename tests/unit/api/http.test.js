import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { request, ApiError, onUnauthorized } from '../../../src/api/http'

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

  it('sends no CSRF header where there is no document, like in Node', async () => {
    vi.stubGlobal('document', undefined)
    const fetch = respond(200, {})
    vi.stubGlobal('fetch', fetch)
    await request('POST', '/api/validate', {})
    expect(fetch.mock.calls[0][1].headers['X-XSRF-TOKEN']).toBeUndefined()
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

  it('turns a network failure into an ApiError with status 0', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    const error = await request('GET', '/api/plans').catch(e => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(0)
    expect(error.message).toBe("Couldn't reach the server")
  })

  it('passes an abort on as it is, not as a network failure', async () => {
    const abort = new DOMException('aborted', 'AbortError')
    const fetch = vi.fn().mockRejectedValue(abort)
    vi.stubGlobal('fetch', fetch)
    const controller = new AbortController()
    controller.abort()
    const error = await request('POST', '/api/validate', {}, { signal: controller.signal }).catch(e => e)
    expect(fetch.mock.calls[0][1].signal).toBe(controller.signal)
    expect(error).toBe(abort)
  })

  it('tells the listeners about a 401 and says the session expired', async () => {
    vi.stubGlobal('fetch', respond(401))
    const listener = vi.fn()
    const unsubscribe = onUnauthorized(listener)
    const error = await request('GET', '/api/plans').catch(e => e)
    unsubscribe()
    expect(listener).toHaveBeenCalledOnce()
    expect(error.status).toBe(401)
    expect(error.message).toBe('Your session has expired. Log in again.')
  })

  it("keeps a 401's own detail, like a wrong password", async () => {
    vi.stubGlobal('fetch', respond(401, { status: 401, title: 'Unauthorized', detail: 'Wrong email or password' }))
    const error = await request('POST', '/api/auth/login', {}).catch(e => e)
    expect(error.message).toBe('Wrong email or password')
  })

  it('stops telling a listener after it unsubscribes', async () => {
    vi.stubGlobal('fetch', respond(401))
    const listener = vi.fn()
    onUnauthorized(listener)()
    await request('GET', '/api/plans').catch(() => {})
    expect(listener).not.toHaveBeenCalled()
  })

  it('falls back to the HTTP status when the error has no body', async () => {
    vi.stubGlobal('fetch', respond(403))
    const error = await request('POST', '/api/plans', {}).catch(e => e)
    expect(error.status).toBe(403)
    expect(error.message).toBe('HTTP 403')
  })
})
