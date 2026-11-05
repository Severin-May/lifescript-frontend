import { beforeAll, afterAll, vi } from 'vitest'
import { BACKEND } from './backend'

// Node's fetch has no cookie jar: keep the session and XSRF-TOKEN cookies like a browser would.
export function useBrowserSession() {
  const cookies = new Map()
  const cookieHeader = () => [...cookies].map(([name, value]) => `${name}=${value}`).join('; ')

  beforeAll(() => {
    const realFetch = globalThis.fetch
    vi.stubGlobal('document', { get cookie() { return cookieHeader() } })
    vi.stubGlobal('fetch', async (path, options = {}) => {
      const response = await realFetch(BACKEND + path, {
        ...options,
        headers: { ...options.headers, Cookie: cookieHeader() }
      })
      for (const setCookie of response.headers.getSetCookie()) {
        const [pair, ...attributes] = setCookie.split(';')
        const [name, value] = pair.split('=')
        const expired = !value || attributes.some(a => a.trim().toLowerCase() === 'max-age=0')
        if (expired) cookies.delete(name.trim())
        else cookies.set(name.trim(), value)
      }
      return response
    })
  })

  afterAll(() => vi.unstubAllGlobals())
}
