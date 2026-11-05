export class ApiError extends Error {
  constructor(status, detail) {
    super(detail)
    this.status = status
  }
}

const UNSAFE_METHODS = ['POST', 'PUT', 'DELETE']

// Read on every request: the backend issues a new token after login and logout.
function csrfToken() {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

export async function request(method, path, body) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (UNSAFE_METHODS.includes(method)) {
    const token = csrfToken()
    if (token) headers['X-XSRF-TOKEN'] = token
  }

  const response = await fetch(path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  })
  const result = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(response.status, result?.detail ?? result?.title ?? `HTTP ${response.status}`)
  }
  return result
}
