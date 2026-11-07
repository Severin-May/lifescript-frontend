import { describe, it, expect, vi, beforeEach } from 'vitest'
import { request, ApiError } from '../../../src/api/http'
import { login, register, logout, currentUser } from '../../../src/api/authApi'

vi.mock('../../../src/api/http', async (original) => ({ ...await original(), request: vi.fn() }))

describe('authApi', () => {
  beforeEach(() => { request.mockReset().mockResolvedValue({ id: '1', email: 'a@b.c' }) })

  it.each([
    ['login', login, '/api/auth/login'],
    ['register', register, '/api/auth/register']
  ])('%s fetches a fresh CSRF token first', async (_, call, path) => {
    await call('a@b.c', 'password123')
    expect(request.mock.calls).toEqual([
      ['GET', '/api/auth/csrf'],
      ['POST', path, { email: 'a@b.c', password: 'password123' }]
    ])
  })

  it('logs out with a POST', async () => {
    await logout()
    expect(request).toHaveBeenCalledWith('POST', '/api/auth/logout')
  })

  it('currentUser returns the user', async () => {
    expect(await currentUser()).toEqual({ id: '1', email: 'a@b.c' })
  })

  it('currentUser returns null when not logged in', async () => {
    request.mockRejectedValue(new ApiError(401, 'Unauthorized'))
    expect(await currentUser()).toBeNull()
  })

  it('currentUser passes other errors on', async () => {
    request.mockRejectedValue(new ApiError(0, "Couldn't reach the server"))
    await expect(currentUser()).rejects.toThrow("Couldn't reach the server")
  })
})
