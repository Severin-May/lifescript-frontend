import { describe, it, expect, vi, beforeEach } from 'vitest'
import { request } from '../../../src/api/http'
import { timeZone } from '../../../src/api/timeZone'
import { listPlans, getPlan, createPlan, updatePlan, deletePlan } from '../../../src/api/plansApi'

vi.mock('../../../src/api/http', async (original) => ({ ...await original(), request: vi.fn() }))

describe('plansApi', () => {
  beforeEach(() => { request.mockReset().mockResolvedValue(null) })

  it.each([
    ['listPlans', () => listPlans(), ['GET', '/api/plans']],
    ['getPlan', () => getPlan('p1'), ['GET', '/api/plans/p1']],
    ['createPlan', () => createPlan('Week', 'period:'), ['POST', '/api/plans', { name: 'Week', content: 'period:', timeZone }]],
    ['updatePlan', () => updatePlan('p1', { name: 'Week', content: 'period:', version: 3 }),
      ['PUT', '/api/plans/p1', { name: 'Week', content: 'period:', version: 3, timeZone }]],
    ['deletePlan', () => deletePlan('p1'), ['DELETE', '/api/plans/p1']]
  ])('%s sends the right request', async (_, call, expected) => {
    await call()
    expect(request).toHaveBeenCalledWith(...expected)
  })
})
