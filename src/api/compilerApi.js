import { request } from './http'
import { timeZone } from './timeZone'

async function check(path, content, options) {
  const result = await request('POST', path, { content, timeZone }, options)
  if (!Array.isArray(result?.diagnostics)) throw new Error('Unexpected response from server')
  return result
}

export function validate(content, options) {
  return check('/api/validate', content, options)
}

export function compile(content) {
  return check('/api/compile', content)
}
