import { request } from './http'
import { timeZone } from './timeZone'

export function listPlans() {
  return request('GET', '/api/plans')
}

export function getPlan(id) {
  return request('GET', `/api/plans/${id}`)
}

export function createPlan(name, content) {
  return request('POST', '/api/plans', { name, content, timeZone })
}

export function updatePlan(id, { name, content, version }) {
  return request('PUT', `/api/plans/${id}`, { name, content, version, timeZone })
}

export function deletePlan(id) {
  return request('DELETE', `/api/plans/${id}`)
}
