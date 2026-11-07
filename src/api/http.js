export class ApiError extends Error {
  constructor(status, detail) {
    super(detail)
    this.status = status
  }
}

const UNSAFE_METHODS = ['POST', 'PUT', 'DELETE']
const SESSION_EXPIRED = 'Your session has expired. Log in again.'

const unauthorizedListeners = new Set()

export function onUnauthorized(listener) {
  unauthorizedListeners.add(listener)
  return () => unauthorizedListeners.delete(listener)
}

// Read on every request: the backend issues a new token after login and logout.
function csrfToken() {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

export async function request(method, path, body, { signal } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (UNSAFE_METHODS.includes(method)) {
    const token = csrfToken()
    if (token) headers['X-XSRF-TOKEN'] = token
  }

  let response
  try {
    response = await fetch(path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal
    })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new ApiError(0, "Couldn't reach the server")
  }
  const result = await response.json().catch(() => null)
  if (response.status === 401) {
    unauthorizedListeners.forEach(listener => listener())
    // A bare 401 means the session is gone; a wrong password comes with its own detail.
    throw new ApiError(401, result?.detail ?? SESSION_EXPIRED)
  }
  if (!response.ok) {
    throw new ApiError(response.status, result?.detail ?? result?.title ?? `HTTP ${response.status}`)
  }
  return result
}
