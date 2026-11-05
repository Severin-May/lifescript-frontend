import { timeZone } from './timeZone'

async function post(path, content) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, timeZone })
  })
  const result = await response.json().catch(() => null)
  if (!Array.isArray(result?.diagnostics)) {
    throw new Error(`Unexpected response from server (HTTP ${response.status})`)
  }
  return result
}

export function validate(content) {
  return post('/api/validate', content)
}

export function compile(content) {
  return post('/api/compile', content)
}

export function clientError(message) {
  return {
    valid: false,
    diagnostics: [{
      stage: 'CLIENT',
      severity: 'ERROR',
      message,
      startLineNumber: 0,
      startColumn: 0,
      endLineNumber: 0,
      endColumn: 0
    }],
    schedule: null
  }
}
