import { useState, useEffect, useCallback } from 'react'
import { listPlans, deletePlan } from '../api/plansApi'

export function usePlanList(user) {
  const [plans, setPlans] = useState([])
  const [error, setError] = useState(null)
  const [reloads, setReloads] = useState(0)

  useEffect(() => {
    if (!user) return
    let current = true
    listPlans()
      .then(result => { if (current) { setPlans(result); setError(null) } })
      .catch(err => { if (current) setError(err.message) })
    return () => { current = false }
  }, [user, reloads])

  const refresh = useCallback(() => setReloads(n => n + 1), [])

  const remove = async (id) => {
    await deletePlan(id)
    refresh()
  }

  return { plans: user ? plans : [], error: user ? error : null, refresh, remove }
}
