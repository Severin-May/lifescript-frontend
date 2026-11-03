import { beforeAll, afterAll, vi } from 'vitest'

export const BACKEND = 'http://localhost:8080'

// The app calls relative /api paths, which only the Vite dev server proxies; tests call the backend directly.
export function useBackend() {
  beforeAll(() => {
    const realFetch = globalThis.fetch
    vi.stubGlobal('fetch', (path, options) => realFetch(BACKEND + path, options))
  })

  afterAll(() => vi.unstubAllGlobals())
}
