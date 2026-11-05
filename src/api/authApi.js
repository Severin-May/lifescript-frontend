import { request, ApiError } from './http'

export function fetchCsrfToken() {
  return request('GET', '/api/auth/csrf')
}

export async function currentUser() {
  try {
    return await request('GET', '/api/auth/me')
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null
    throw error
  }
}

// Logging out deletes the CSRF cookie, so get a fresh one before logging in again.
export async function login(email, password) {
  await fetchCsrfToken()
  return request('POST', '/api/auth/login', { email, password })
}

export async function register(email, password) {
  await fetchCsrfToken()
  return request('POST', '/api/auth/register', { email, password })
}

export function logout() {
  return request('POST', '/api/auth/logout')
}
