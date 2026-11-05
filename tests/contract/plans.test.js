import { describe, it, expect } from 'vitest'
import { register, logout, currentUser } from '../../src/api/authApi'
import { listPlans, getPlan, createPlan, updatePlan, deletePlan } from '../../src/api/plansApi'
import { ApiError } from '../../src/api/http'
import { useBrowserSession } from '../support/browserSession'

const statusOf = (promise) => promise.then(() => 'ok', error => error instanceof ApiError ? error.status : error)

describe('accounts and saved plans contract', () => {
  useBrowserSession()

  it('saves, updates, refuses a stale update, deletes and logs out', async () => {
    const email = `contract-${crypto.randomUUID()}@example.com`
    expect(await register(email, 'password123')).toEqual({ id: expect.any(String), email })
    expect(await currentUser()).toMatchObject({ email })

    const created = await createPlan('Exam week', 'period:\n')
    expect(created).toMatchObject({ name: 'Exam week', content: 'period:\n', valid: false, version: 0 })
    expect(await listPlans()).toEqual([
      { id: created.id, name: 'Exam week', valid: false, version: 0, updatedAt: expect.any(String) }
    ])

    const updated = await updatePlan(created.id, { name: 'Exam week', content: 'period:\n    ', version: 0 })
    expect(updated.version).toBeGreaterThan(0)
    expect((await getPlan(created.id)).content).toBe('period:\n    ')

    expect(await statusOf(updatePlan(created.id, { name: 'Exam week', content: 'old', version: 0 }))).toBe(409)
    expect(await statusOf(createPlan('  ', ''))).toBe(400)

    await deletePlan(created.id)
    expect(await statusOf(getPlan(created.id))).toBe(404)

    await logout()
    expect(await currentUser()).toBeNull()
    expect(await statusOf(listPlans())).toBe(401)
  })
})
